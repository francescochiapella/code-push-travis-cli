import codePushRelease from "steps/release-react";

describe("`codePushRelease` function", () => {

    const execSync = sinon.spy();

    before(() => {
        codePushRelease.__Rewire__("execSync", execSync);
    });

    beforeEach(() => {
        execSync.reset();
    });

    after(() => {
        codePushRelease.__ResetDependency__("execSync");
    });

    describe("`targetBinary` function", () => {

        const targetBinary = codePushRelease.__get__("targetBinary");

        it("returns the target binary option if `TARGET_BINARY` is defined", () => {
            const ret = targetBinary(">1.0.0");
            expect(ret).to.equal('-t ">1.0.0"');
        });

        it("returns an empty string if `TARGET_BINARY` is not defined", () => {
            const ret = targetBinary();
            expect(ret).to.equal("");
        });

    });

    describe("`appName` function", () => {  
        
        const appName = codePushRelease.__get__("appName");

        it("return the app name [CASE: no android or ios code-push app name specified]", () => {
            const argv = {
            };
            const ret = appName("nameOfPackage", "platform", argv);
            expect(ret).to.equal('"nameOfPackage-platform"');
        });

        it("return the app name [CASE: android code-push app name is specified on android platform]", () => {
            const argv = {
                na:"nameOfPackage"
            };
            const ret = appName("nameOfPackage", "android", argv);
            expect(ret).to.equal('"nameOfPackage"');
        });
        
        it("return the app name [CASE: ios code-push app name is specified on ios platform]", () => {
            const argv = {
                ni:"nameOfPackage"
            };
            const ret = appName("nameOfPackage", "ios", argv);
            expect(ret).to.equal('"nameOfPackage"');
        });

        it("return the app name [CASE: android code-push app name is specified on ios platform]", () => {
            const argv = {
                na:"nameOfPackage"
            };
            const ret = appName("nameOfPackage", "ios", argv);
            expect(ret).to.equal('"nameOfPackage-ios"');
        });
        
        it("return the app name [CASE: ios code-push app name is specified on android platform]", () => {
            const argv = {
                ni:"nameOfPackage"
            };
            const ret = appName("nameOfPackage", "android", argv);
            expect(ret).to.equal('"nameOfPackage-android"');
        });
    });

    describe("`codePushFrameworkRelease` function", () => {

        const codePushFrameworkRelease = codePushRelease.__get__("codePushFrameworkRelease");

        it("returns the correct command to release [CASE: targetBinary is specified]", () => {
            const argv = {
                deploymentName: "deploymentName",
                description: "description for the deploy",
                mandatory: true,
                framework: "reactnative",
                targetBinary: "targetBinary",
                development: true
            };
            const platform = "platform";
            const pkg = {
                name: "nameOfPackage"
            };
            const ret = codePushFrameworkRelease(argv, platform, pkg);
            expect(ret).to.equal(
                'code-push release-react "nameOfPackage-platform" platform -d "deploymentName" --des "description for the deploy" --dev true -m true -t "targetBinary"'
            );
        });

        it("returns the correct command to release [CASE: targetBinary is not specified]", () => {
            const argv = {
                deploymentName: "deploymentName",
                description: "description for the deploy",
                mandatory: true,
                framework: "reactnative",
                development: true
            };
            const platform = "platform";
            const pkg = {
                name: "nameOfPackage"
            };
            const ret = codePushFrameworkRelease(argv, platform, pkg);
            expect(ret).to.equal(
                'code-push release-react "nameOfPackage-platform" platform -d "deploymentName" --des "description for the deploy" --dev true -m true '
            );
        });

        it("returns the correct command to release [CASE: framework is specified]", () => {
            const argv = {
                deploymentName: "deploymentName",
                description: "description for the deploy",
                mandatory: true,
                framework: "cordova",
                targetBinary: "targetBinary",
                development: true
            };
            const platform = "platform";
            const pkg = {
                name: "nameOfPackage"
            };
            const ret = codePushFrameworkRelease(argv, platform, pkg);
            expect(ret).to.equal(
                'code-push release-cordova "nameOfPackage-platform" platform -d "deploymentName" --des "description for the deploy"  -m true -t "targetBinary"'
            );
        });

        it("returns the correct command to release [CASE: framework is not specified]", () => {
            const argv = {
                deploymentName: "deploymentName",
                description: "description for the deploy",
                mandatory: true,
                targetBinary: "targetBinary",
                development: true
            };
            const platform = "platform";
            const pkg = {
                name: "nameOfPackage"
            };
            const ret = codePushFrameworkRelease(argv, platform, pkg);
            expect(ret).to.equal(
                'code-push release-react "nameOfPackage-platform" platform -d "deploymentName" --des "description for the deploy" --dev true -m true -t "targetBinary"'
            );
        });
    });

    describe("`codePushFrameworkReleaseStatus` function", () => {
        const argv = {
        };

        const codePushFrameworkReleaseStatus = codePushRelease.__get__("codePushFrameworkReleaseStatus");

        it("returns the correct command to release", () => {
            const packageName = "nameOfPackage";
            const platform = "platform";
            const ret = codePushFrameworkReleaseStatus(argv, packageName, platform);
            expect(ret).to.equal(
                'code-push deployment list "nameOfPackage-platform"'
            );
        });

    });

    it("calls `execSync` function with the correct command", () => {
        const argv = {
            deploymentName: "deploymentName",
            description: "description for the deploy",
            mandatory: true,
            framework: "reactnative",
            targetBinary: "targetBinary",
            development: true,
        };
        const platform = "platform";
        const pkg = {
            name: "nameOfPackage"
        };
        
        codePushRelease(argv, platform, pkg);
        expect(execSync).to.have.callCount(2);
        expect(execSync.firstCall).to.have.been.calledWithExactly(
            'code-push release-react "nameOfPackage-platform" platform -d "deploymentName" --des "description for the deploy" --dev true -m true -t "targetBinary"', {stdio: [0, 1, 2]}
        );
        expect(execSync.secondCall).to.have.been.calledWithExactly(
            'code-push deployment list "nameOfPackage-platform"', {stdio: [0, 1, 2]}
        );
    });

});
