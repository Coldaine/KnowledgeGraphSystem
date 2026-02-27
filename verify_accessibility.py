from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to localhost:3000...")
        page.goto("http://localhost:3000")

        # Wait for some content to load. The graph might take a moment.
        # We look for a canvas or some text.
        print("Waiting for content...")
        try:
            page.wait_for_selector(".react-flow__renderer", timeout=10000)
            print("Graph renderer found.")
        except:
            print("Graph renderer not found, saving debug screenshot.")
            page.screenshot(path="/home/jules/verification/debug.png")
            browser.close()
            return

        # Give it a bit more time for nodes to appear
        time.sleep(2)

        # Press Tab to focus the first interactive element
        print("Pressing Tab...")
        page.keyboard.press("Tab")
        time.sleep(0.5)

        # Take a screenshot
        print("Taking screenshot...")
        page.screenshot(path="/home/jules/verification/accessibility_focus.png")

        browser.close()

if __name__ == "__main__":
    run()
