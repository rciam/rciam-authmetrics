from locust import HttpUser, task, between


class WebsiteUser(HttpUser):
    # wait_time can be overridden for individual TaskSets
    wait_time = between(10, 300)

    # Host for locust interface: https://metrics-dev.rciam.grnet.gr
    @task
    def metrics_egi_devel_tenenv(self):
        headers = {
            'accept': 'application/json',
            'x-tenant': 'egi',
            'x-environment': 'devel'
        }

        self.client.get("/api/v1/tenenv/egi/devel", headers=headers)
        self.client.get("/api/v1/tenenv/einfra/devel", headers=headers)
       
