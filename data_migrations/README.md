# rciam-ip2country
A Python-based tool for mapping ips to countries and store the respective login information to a DB.
## Prerequisites
This script uses MaxMind GeoIP2 Databases (commercial version).
You must put the .mmdb files (`GeoLite2-Country.mmdb`) to the folder `databases`.

## Installation
```
git clone https://github.com/rciam/rciam-ip2country.git
cd rciam-ip2country
cp config.py.example config.py
vi config.py
```

Create a Python virtualenv, install dependencies, and run the script
```
virtualenv -p python3 .venv
source .venv/bin/activate
(venv) pip3 install -r requirements.txt
(venv) python3 -m Utils.install
(venv) python3 ipToCountry.py
🍺
```

## License
Licensed under the Apache 2.0 license, for details see LICENSE.



