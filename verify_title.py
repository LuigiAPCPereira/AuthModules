from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:8080")
            page.wait_for_load_state("networkidle")

            # Verify Title
            title = page.title()
            print(f"Page title: {title}")
            if title != "QuantumShards Auth":
                print("Title verification FAILED")
            else:
                print("Title verification PASSED")

            # Verify Meta Tags
            og_title = page.locator('meta[property="og:title"]').get_attribute("content")
            print(f"og:title: {og_title}")
            if og_title != "QuantumShards Auth":
                print("og:title verification FAILED")
            else:
                print("og:title verification PASSED")

            author = page.locator('meta[name="author"]').get_attribute("content")
            print(f"author: {author}")
            if author != "QuantumShards":
                print("author verification FAILED")
            else:
                print("author verification PASSED")

            twitter_site = page.locator('meta[name="twitter:site"]').get_attribute("content")
            print(f"twitter:site: {twitter_site}")
            if twitter_site != "@QuantumShards":
                 print("twitter:site verification FAILED")
            else:
                 print("twitter:site verification PASSED")

            page.screenshot(path="verification_screenshot.png")
            print("Screenshot saved to verification_screenshot.png")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
