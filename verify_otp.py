from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Navigate to the app
    page.goto("http://localhost:8080/AuthModules/")

    # Click "Verificação" tab
    page.get_by_role("tab", name="Verificação").click()

    # Wait for the heading
    page.wait_for_selector("text=Verificar e-mail")

    # Verify input label
    input_field = page.get_by_label("Código de verificação")
    if not input_field.is_visible():
        print("Input not visible!")
        browser.close()
        return

    # Take screenshot
    page.screenshot(path="/home/jules/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
