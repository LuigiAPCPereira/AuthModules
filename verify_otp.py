from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:8080/AuthModules/")

    # Wait for the verify tab to appear
    page.wait_for_selector('text="Verificação"')

    # Click the verify tab
    page.click('text="Verificação"')

    # Wait for the verify screen
    page.wait_for_selector('text="Insira o código de 6 dígitos enviado para o seu e-mail."')

    # Take screenshot of empty state
    page.screenshot(path="verification_empty.png")

    # Type the code into the input
    page.keyboard.type("123456")

    # Wait for update
    page.wait_for_timeout(500)

    # Take screenshot of filled state
    page.screenshot(path="verification_filled.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
