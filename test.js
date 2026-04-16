const { Builder, By, until } = require('selenium-webdriver');

async function runTests() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        console.log("🔹 Starting Tests...\n");

        // =========================
        // 1. LOGIN TEST
        // =========================
        console.log("👉 Running Login Test...");

        await driver.get('http://localhost:5000');

        await driver.sleep(2000);

        let inputs = await driver.findElements(By.tagName('input'));

        if (inputs.length >= 2) {
            await inputs[0].sendKeys('admin');
            await inputs[1].sendKeys('1234');
        }

        let buttons = await driver.findElements(By.tagName('button'));
        if (buttons.length > 0) {
            await buttons[0].click();
        }

        await driver.sleep(3000);

        console.log("✅ Login Test Completed\n");


        // =========================
        // 2. ADD PATIENT TEST
        // =========================
        console.log("👉 Running Add Patient Test...");

        await driver.get('http://localhost:5000/add-patient');

        await driver.sleep(2000);

        let patientInputs = await driver.findElements(By.tagName('input'));

        if (patientInputs.length >= 3) {
            await patientInputs[0].sendKeys('Rahul Sharma');
            await patientInputs[1].sendKeys('25');
            await patientInputs[2].sendKeys('Fever');
        }

        let submitBtn = await driver.findElements(By.tagName('button'));
        if (submitBtn.length > 0) {
            await submitBtn[0].click();
        }

        await driver.sleep(3000);

        console.log("✅ Add Patient Test Completed\n");


        // =========================
        // 3. VIEW PATIENTS TEST
        // =========================
        console.log("👉 Running View Patients Test...");

        await driver.get('http://localhost:5000/patients');

        await driver.sleep(3000);

        console.log("✅ Patients Page Opened\n");


        // =========================
        // 4. DELETE PATIENT TEST
        // =========================
        console.log("👉 Running Delete Patient Test...");

        let deleteButtons = await driver.findElements(By.xpath("//button[contains(text(),'Delete')]"));

        if (deleteButtons.length > 0) {
            await deleteButtons[0].click();

            try {
                let alert = await driver.switchTo().alert();
                await alert.accept();
            } catch (e) {}

            await driver.sleep(2000);
            console.log("✅ Delete Patient Test Completed\n");
        } else {
            console.log("⚠️ No Delete button found\n");
        }

        console.log("🎉 ALL TESTS COMPLETED");

    } catch (error) {
        console.log("❌ Test Failed");
        console.log(error);
    } finally {
        await driver.quit();
    }
}

runTests();