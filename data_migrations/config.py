[source_database]

host=localhost
database=egi_dev_registry
user=postgres
password=71902102

[source_database_proxy]

host=localhost
database=egi_dev_proxy
user=postgres
password=71902102

[source_tables]

ip_table=statistics_ip
vos_comanage=cm_cous
users_comanage=cm_co_people
vo_memberships_comanage=cm_co_person_roles
statistics_country_hashed_comanage=statistics_country_hashed
identity_providers_map_proxy=identityprovidersmap
service_providers_map_proxy=serviceprovidersmap

[destination_database]

# host=localhost
# database=rciam_metrics
# user=postgres
# password=71902102

host=172.19.0.2
database=metrics_dev
user=rciam
password=secret

[destination_tables]

#country_table=statistics_country

#user_country_table=statistics_user_country
vos=community
vos_information=community_info
vo_memberships=members
users=users
identity_providers_map=identityprovidersmap
service_providers_map=serviceprovidersmap
statistics_country_hashed=statistics_country_hashed
countries=country_codes

[logging]

level = INFO
folder = log
file = metricsMigrate.log

[database_file]

db_filename = GeoLite2-Country.mmdb