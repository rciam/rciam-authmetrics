import React, {useState, useEffect} from "react";
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import Datatable from "../datatable";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import DatePicker from "react-datepicker";
import 'react-toastify/dist/ReactToastify.css';
import 'react-dropdown/style.css';
import "react-datepicker/dist/react-datepicker.css";
import {useQuery, useQueryClient} from "react-query";
import {loginsPerSpKey, minDateLoginsKey, countriesKey} from "../../utils/queryKeys";
import {getLoginsPerSP, getMinDateLogins, getCountries} from "../../utils/queries";
import {useCookies} from "react-cookie";
import {createAnchorElement, formatStartDate, formatEndDate} from "../Common/utils";
import Spinner from "../Common/spinner";

const SpsDataTable = ({
                        idpId,
                        dataTableId = "table-sp",
                        tenenvId,
                        uniqueLogins,
                        setStartDate,
                        setEndDate,
                        startDate,
                        endDate
                      }) => {
  const [cookies, setCookie] = useCookies();
  const permissions = cookies.permissions
  const tenant = cookies['x-tenant']
  const environment = cookies['x-environment']

  const [spsLogins, setSpsLogins] = useState([]);
  const [minDate, setMinDate] = useState("");
  const [btnPressed, setBtnPressed] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [tempSelectedCountries, setTempSelectedCountries] = useState([]);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const queryClient = useQueryClient();

  let params = {
    params: {
      'startDate': !startDate ? null : formatStartDate(startDate),
      'endDate': !endDate ? null : formatEndDate(endDate),
      'idp': idpId,
      'tenenv_id': tenenvId,
      'unique_logins': uniqueLogins,
      'countries': selectedCountries.length > 0 ? selectedCountries : null
    },
  }

  const loginsPerSp = useQuery(
    [loginsPerSpKey, params],
    getLoginsPerSP,
    {
      enabled: false
    }
  )

  const minDateLogins = useQuery(
    [minDateLoginsKey, params],
    getMinDateLogins,
    {
      enabled: false,
      refetchOnWindowFocus: false
    }
  )

  const countries = useQuery(
    [countriesKey, { params: { tenenv_id: tenenvId } }],
    getCountries,
    {
      enabled: !!tenenvId,
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    params = {
      params: {
        'startDate': !startDate ? null : formatStartDate(startDate),
        'endDate': !endDate ? null : formatEndDate(endDate),
        'idp': idpId,
        'tenenv_id': tenenvId,
        'unique_logins': uniqueLogins,
        'countries': selectedCountries.length > 0 ? selectedCountries : null
      },
    }

    try {
      const response = queryClient.refetchQueries([loginsPerSpKey, params])
      queryClient.refetchQueries([minDateLoginsKey, {params:{tenenv_id: tenenvId}}])
    } catch (error) {
      // todo: Here we can handle any authentication or authorization errors
      console.error(SpsDataTable.name + " error: " + error)
    }

  }, [uniqueLogins, btnPressed, selectedCountries])

  // Construct the data required for the datatable
  useEffect(() => {
    if (!loginsPerSp.isLoading && !loginsPerSp.isFetching && loginsPerSp.isSuccess && loginsPerSp?.data) {
      const perSp = loginsPerSp.data.map((sp, index) => {
        let loginCount;
        if (selectedCountries.length > 0) {
          // Create a map of selected country codes to country names for lookup
          const selectedCountryMap = {};
          countries.data?.forEach(country => {
            if (selectedCountries.includes(country.id)) {
              selectedCountryMap[country.countrycode] = country.country;
            }
          });

          // For each selected country, find the count or show 0
          const countryCounts = selectedCountries.map(countryId => {
            // Find the country name for this ID
            const countryInfo = countries.data?.find(c => c.id === countryId);
            if (!countryInfo) return null;

            // Find if this SP has logins from this country
            const spCountry = sp.countries.find(c => c.countrycode === countryInfo.countrycode);
            const count = spCountry ? spCountry.count : 0;

            return {
              name: countryInfo.country,
              count: count,
              display: `${countryInfo.country}: ${count} `
            };
          }).filter(Boolean) // Remove nulls
            .sort((a, b) => b.count - a.count); // Sort by count descending

          // Compute total sum for sorting
          const totalSum = countryCounts.reduce((sum, item) => sum + item.count, 0);

          // Format as object with display and sort
          loginCount = {
            display: countryCounts.map(item => item.display).join('||'),
            sort: totalSum
          };
        } else {
          // No countries selected - show total count from all countries
          loginCount = sp.countries.reduce((sum, country) => sum + country.count, 0);
        }

        return {
          "Service Provider Name": (cookies.userinfo == undefined && !!permissions?.actions?.service_providers?.['view']) ? sp.name : createAnchorElement(sp.name != '' ? sp.name : sp.identifier, `/metrics/services/${sp.id}`),
          "Service Provider Identifier": sp.identifier,
          "Number of Logins": loginCount
        };
      });

      if (!!loginsPerSp?.data && !!perSp) {
        if (minDate == undefined || minDate == "") {
          setMinDate(!!minDateLogins?.data?.min_date ? new Date(minDateLogins?.data?.min_date) : null)
        }
        // This is essential: We must destroy the datatable in order to be refreshed with the new data
        $("#" + dataTableId).DataTable().destroy()
        setSpsLogins(perSp)

        if (shouldScroll) {
          setTimeout(() => {
            const tableElement = document.getElementById(dataTableId);
            if (tableElement) {
              tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
          setShouldScroll(false);
        }
      }
    }
  }, [uniqueLogins, loginsPerSp.isSuccess && minDateLogins.isSuccess, selectedCountries])

  const handleStartDateChange = (date) => {
    if (date != null) {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (date) => {

    //date = formatEndDate(date);
    if (date != null) {
      setEndDate(date);
    }
  };

  const handleCountryChange = (countryId, checked) => {
    if (checked) {
      setTempSelectedCountries(prev => [...prev, countryId]);
    } else {
      setTempSelectedCountries(prev => prev.filter(id => id !== countryId));
    }
  };

  const handleApplyCountries = () => {
    setSelectedCountries(tempSelectedCountries);
    setShowCountryModal(false);
    setCountrySearchQuery(""); // Reset search query
    setShouldScroll(true);
  };

  const handleOpenCountryModal = () => {
    setTempSelectedCountries([...selectedCountries]);
    setShowCountryModal(true);
  };

  const handleSelectAllCountries = () => {
    if (countries.data) {
      setTempSelectedCountries(countries.data.map(country => country.id));
    }
  };

  const handleClearAllCountries = () => {
    setTempSelectedCountries([]);
  };

  // Filter countries based on search query
  const filteredCountries = countries.data?.filter(country => 
    country.country?.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
    country.countrycode?.toLowerCase().includes(countrySearchQuery.toLowerCase())
  ) || [];
  const handleFilterClick = () => {
    setBtnPressed((prev) => !prev);
    setShouldScroll(true);
  };

  if (loginsPerSp.isLoading
    || loginsPerSp.isFetching) {
    return (<Spinner/>)
  }

  return (
    <Row className="box">
      <Col md={12}>
        <div className="box-header with-border">
          <h3 className="box-title">Number of logins</h3>
        </div>
      </Col>
      <Col lg={12} className="range_inputs">
        From: <DatePicker selected={startDate}
                          minDate={minDate}
                          dateFormat="dd/MM/yyyy"
                          onChange={handleStartDateChange}
      />
        To: <DatePicker selected={endDate}
                        minDate={minDate}
                        dateFormat="dd/MM/yyyy"
                        onChange={handleEndDateChange}
      />
        {cookies.userinfo && (
          <Button variant="outline-secondary" onClick={handleOpenCountryModal}>
            Countries ({selectedCountries.length} selected)
          </Button>
        )}
        {/* Probably add a tooltip here that both fields are required */}
        <Button variant="light"
                disabled={startDate == undefined || endDate == undefined}
                onClick={handleFilterClick}>
          Filter
        </Button>
      </Col>
      <Col lg={12}>
        <Datatable items={spsLogins}
                   dataTableId={dataTableId}
                   columnSep={cookies.userinfo ? "Number of Logins" : undefined}/>
      </Col>

      {/* Country Selection Modal */}
      <Modal show={showCountryModal} onHide={() => setShowCountryModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Select Countries</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Info box */}
          <div className="alert alert-info mb-3" role="alert">
            <strong>Info:</strong> Only countries that have data in the database are shown below.
          </div>

          {/* Search input */}
          <div className="mb-3">
            <Form.Control 
              type="text" 
              placeholder="Search countries..."
              value={countrySearchQuery}
              onChange={(e) => setCountrySearchQuery(e.target.value)}
            />
          </div>

          <div style={{maxHeight: '400px', overflowY: 'auto'}}>
            {countries.isSuccess && filteredCountries.length > 0 &&
              [...filteredCountries]
                .sort((a, b) => (a.country || 'Unknown').localeCompare(b.country || 'Unknown'))
                .map(country => (
                  <div
                    key={country.id}
                    className="mb-2"
                    style={{cursor: 'pointer', padding: '4px 0'}}
                    onClick={() => handleCountryChange(country.id, !tempSelectedCountries.includes(country.id))}
                  >
                    <Form.Check
                      type="checkbox"
                      label={`${country.country || 'Unknown'} (${country.countrycode})`}
                      checked={tempSelectedCountries.includes(country.id)}
                      onChange={(e) => handleCountryChange(country.id, e.target.checked)}
                      style={{pointerEvents: 'none'}} // Prevent double-clicking
                    />
                  </div>
                ))
            }
            {filteredCountries.length === 0 && (
              <div className="text-center text-muted">
                {countrySearchQuery ? 'No countries found matching your search.' : 'Loading countries...'}
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleSelectAllCountries}>
            Select All
          </Button>
          <Button variant="outline-danger" onClick={handleClearAllCountries}>
            Clear All
          </Button>
          <Button variant="primary" onClick={handleApplyCountries}>
            Apply Filter ({tempSelectedCountries.length} selected)
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  )

}

export default SpsDataTable