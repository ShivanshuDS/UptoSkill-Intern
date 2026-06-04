import requests
import time

def retry_request(url):

    for attempt in range(3):

        try:
            response = requests.get(url)

            print("Success")
            print(response.json())
            return
            print(
                f"Retry {attempt + 1} | Status: {response.status_code}"
            )
        except Exception as e:

            print(f"Retry {attempt+1}")

            time.sleep(2)

    return ("Failed after 3 retries")

if __name__ == "__main__":

    result = retry_request(
        "http://127.0.0.1:8000/disconnect"
    )

    print(result)