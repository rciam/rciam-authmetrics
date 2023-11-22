import csv
import psycopg2
import hashlib
from datetime import datetime
from Model.pgConnector import destinationPgConnector


pgConn = destinationPgConnector()

# Define the path to your CSV file
csv_file_path = "einfra_devel_users.csv"


def insert_record(hasheduserid, created_date):
    sql = "INSERT INTO users (hasheduserid, created, updated, status, tenenv_id) VALUES ('{0}','{1}', NULL, 'A',2)".format(
        hasheduserid, created_date
    )
    pgConn.execute_and_commit(sql)


def convert_to_date(timestamp_str):
    """
    Convert a timestamp string to a date string in the format 'YYYY-MM-DD'.
    """
    timestamp_ms = int(timestamp_str)
    timestamp_sec = timestamp_ms / 1000.0  # Convert milliseconds to seconds
    timestamp = datetime.fromtimestamp(timestamp_sec)
    return timestamp.strftime('%Y-%m-%d')

def main():
    # Open and read the CSV file
    with open(csv_file_path, "r") as csv_file:
        csv_reader = csv.reader(csv_file)
        next(csv_reader)  # Skip the header row if it exists
        for row in csv_reader:
            if len(row) != 2:
                print(f"Skipping invalid row: {row}")
                continue
            vo_person_id, created_date = row
            insert_record(hashlib.md5(vo_person_id.encode()).hexdigest(), convert_to_date(created_date))

    print("Data has been inserted into the PostgreSQL database.")


if __name__ == "__main__":
    main()
