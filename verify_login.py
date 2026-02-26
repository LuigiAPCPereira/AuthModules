from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            print("Navigating to http://localhost:8080/AuthModules/")
            page.goto("http://localhost:8080/AuthModules/")

            # Wait for the login form to be visible
            print("Waiting for login form...")
            page.wait_for_selector('form', state='visible', timeout=10000)

            # Check for specific text "Entrar"
            print("Checking content...")
            content = page.content()
            if "Entrar" in content:
                print("Found 'Entrar' text.")
            else:
                print("Could not find 'Entrar' text.")

            # Take screenshot
            print("Taking screenshot...")
            page.screenshot(path="verification_screenshot.png")
            print("Screenshot saved to verification_screenshot.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification_error_failed.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
