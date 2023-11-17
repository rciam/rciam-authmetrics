# migrate-metrics-stats
A Python-based tool for migrating stats from COmanage and SSP to Metrics Database.
## Prerequisites
This script uses MaxMind GeoIP2 Databases (commercial version).
You must put the .mmdb files (`GeoLite2-Country.mmdb`) to the folder `databases`.

## Installation
```
git clone https://github.com/rciam/rciam-migrate-metrics-stats.git
cd rciam-migrate-metrics-stats
cp config.py.example config.py
vi config.py
```

Create a Python virtualenv, install dependencies, and run the script
```
virtualenv -p python3 .venv
source .venv/bin/activate
(venv) pip3 install -r requirements.txt
(venv) python3 -m Utils.install
(venv) python3 migrateData.py
🍺
```

## License
Licensed under the Apache 2.0 license, for details see LICENSE.



