import {
  client as apiClient,
  deleteCookie,
  handleError
} from '../api';


// Tenenv
export const getTenenv = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("tenenv/" + params.tenantId + "/" + params.environment)
    return response.data
  } catch (error) {
    console.error(getTenenv.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}

// Logins
export const getLoginsPerSP = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("logins_per_sp", params)
    return response.data
  } catch (error) {
    console.error(getLoginsPerSP.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}

export const getLoginsPerIdp = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("logins_per_idp", params)
    return response.data
  } catch (error) {
    console.error(getLoginsPerIdp.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}

export const getLoginsPerCountry = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("logins_per_country", params)
    return response.data
  } catch (error) {
    console.error(getLoginsPerCountry.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}

export const getMinDateLogins = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("min_date_logins", params)
    return response.data
  } catch (error) {
    console.error(getMinDateLogins.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}

export const getMinDateCommunities = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("min_date_communities", params)
    return response.data
  } catch (error) {
    console.error(getMinDateCommunities.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}

export const getMinDateRegisteredUsers = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("min_date_registered_users", params)
    return response.data
  } catch (error) {
    console.error(getMinDateRegisteredUsers.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}

export const getLoginsGroupByDay = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("logins_groupby/day", params)
    return response.data
  } catch (error) {
    console.error(getLoginsGroupByDay.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}

export const getLoginsCountBy = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("logins_countby", params)
    return response.data
  } catch (error) {
    console.error(getLoginsCountBy.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}

// Get Idps, Sps
export const getIdps = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("idps", params)
    return response.data
  } catch (error) {
    console.error(getIdps.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}

export const getSps = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("sps", params)
    return response.data
  } catch (error) {
    console.error(getSps.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}

// Users
export const getRegisteredUsersCountby = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("registered_users_countby", params)
    return response.data
  } catch (error) {
    console.error(getRegisteredUsersCountby.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}

export const getRegisteredUsersByCountry = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("registered_users_country", params)
    return response.data
  } catch (error) {
    console.error(getRegisteredUsersByCountry.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}

// Communities
export const getCommunities = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("communities", params)
    return response.data
  } catch (error) {
    console.error(getCommunities.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}

export const getCommunityMembersByStatus = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("members_bystatus", params)
    return response.data
  } catch (error) {
    console.error(getCommunityMembersByStatus.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}

export const getCountryStatsByVo = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get(`country_stats_by_vo/${params.countryId}`, params)
    return response.data
  } catch (error) {
    console.error(getCountryStatsByVo.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}

export const getCommunitiesGroupBy = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get(
      `communities_groupby${(params.groupBy != undefined && params.groupBy != "") ? "/" + params.groupBy : ""}`
      , params.params)
    return response.data
  } catch (error) {
    console.error(getCommunitiesGroupBy.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}

export const getRegisteredUsersPerCountryGroupBy = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get(
      `registered_users_country_group_by${(params.groupBy != undefined && params.groupBy != "") ? "/" + params.groupBy : ""}`
      , params.params)
    return response.data
  } catch (error) {
    console.error(getRegisteredUsersPerCountryGroupBy.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}

export const getRegisteredUsersGroupBy = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get(
      `registered_users_groupby${(params.groupBy != undefined && params.groupBy != "") ? "/" + params.groupBy : ""}`
      , params.params)
    return response.data
  } catch (error) {
    console.error(getRegisteredUsersGroupBy.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}

// Countries
export const getCountries = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("countries_list", params)
    return response.data
  } catch (error) {
    console.error(getCountries.name + ' error', error)
    console.log('queryKeys', queryKey)
    handleError(error)
    return error.response
  }
}