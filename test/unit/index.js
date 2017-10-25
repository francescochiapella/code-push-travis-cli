import path from "path";
import omit from "lodash.omit";

import codePushTravis from "index";
import pkg from "../mocks/package";

describe("`codePushTravis` function", () => {

    const codepushLogin = sinon.spy();
    const codepushLogout = sinon.spy();
    const codePushRelease = sinon.spy();

    before(() => {
        codePushTravis.__Rewire__("codepushLogin", codepushLogin);
        codePushTravis.__Rewire__("codepushLogout", codepushLogout);
        codePushTravis.__Rewire__("codePushRelease", codePushRelease);
    });

    beforeEach(() => {
        process.env = omit(process.env, ["TRAVIS_PULL_REQUEST", "TRAVIS_BRANCH", "TRAVIS_BUILD_DIR", "TRAVIS_TAG"]);
        codepushLogin.reset();
        codepushLogout.reset();
        codePushRelease.reset();
    });

    after(() => {
        process.env = omit(process.env, ["TRAVIS_PULL_REQUEST", "TRAVIS_BRANCH", "TRAVIS_BUILD_DIR", "TRAVIS_TAG"]);
        codePushTravis.__ResetDependency__("codepushLogin");
        codePushTravis.__ResetDependency__("codepushLogout");
        codePushTravis.__ResetDependency__("codePushRelease");
    });

    it("skip all functions [CASE: `TRAVIS_PULL_REQUEST` is true]", () => {
        process.env.TRAVIS_PULL_REQUEST = true;
        process.env.TRAVIS_BRANCH = "master";
        const argv = {
            branchToDeploy: "master"
        };
        codePushTravis(argv);
        expect(codepushLogin).to.have.callCount(0);
        expect(codePushRelease).to.have.callCount(0);
        expect(codepushLogout).to.have.callCount(0);
    });

    it("skip all functions [CASE: `TRAVIS_BRANCH` is not the branchToDeploy and push is not a git tag]", () => {
        process.env.TRAVIS_PULL_REQUEST = false;
        process.env.TRAVIS_BRANCH = "not-master";
        const argv = {
            branchToDeploy: "master"
        };
        codePushTravis(argv);
        expect(codepushLogin).to.have.callCount(0);
        expect(codePushRelease).to.have.callCount(0);
        expect(codepushLogout).to.have.callCount(0);
    });

    it("skip all functions [CASE: `TRAVIS_BRANCH` is not the branchToDeploy and tag check is false]", () => {
        process.env.TRAVIS_PULL_REQUEST = "false";
        process.env.TRAVIS_TAG = "v1.0.0";
        process.env.TRAVIS_BRANCH = "not-master";
        const argv = {
            branchToDeploy: "master",
            tag: false
        };
        codePushTravis(argv);
        expect(codepushLogin).to.have.callCount(0);
        expect(codePushRelease).to.have.callCount(0);
        expect(codepushLogout).to.have.callCount(0);
    });

    it("release to code-push [CASE: platforms contains only android]", () => {
        process.env.TRAVIS_PULL_REQUEST = "false";
        process.env.TRAVIS_BRANCH = "master";
        process.env.TRAVIS_BUILD_DIR = path.join(__dirname, "..", "mocks");
        const argv = {
            branchToDeploy: "master",
            platforms: ["android"]
        };
        codePushTravis(argv);
        expect(codepushLogin).to.have.callCount(1);
        expect(codePushRelease).to.have.callCount(1);
        expect(codePushRelease).to.have.been.calledWithExactly(argv, "android", pkg);
        expect(codepushLogout).to.have.callCount(1);
    });

    it("release to code-push [CASE: platforms contains both android and ios]", () => {
        process.env.TRAVIS_PULL_REQUEST = "false";
        process.env.TRAVIS_BRANCH = "master";
        process.env.TRAVIS_BUILD_DIR = path.join(__dirname, "..", "mocks");
        const argv = {
            branchToDeploy: "master",
            platforms: ["android", "ios"]
        };
        codePushTravis(argv);
        expect(codepushLogin).to.have.callCount(1);
        expect(codePushRelease).to.have.callCount(2);
        expect(codePushRelease.firstCall).to.have.been.calledWithExactly(argv, "android", pkg);
        expect(codePushRelease.secondCall).to.have.been.calledWithExactly(argv, "ios", pkg);
        expect(codepushLogout).to.have.callCount(1);
    });

    it("release to code-push [CASE: git tag]", () => {
        process.env.TRAVIS_PULL_REQUEST = "false";
        process.env.TRAVIS_TAG = "v1.0.0";
        process.env.TRAVIS_BUILD_DIR = path.join(__dirname, "..", "mocks");
        const argv = {
            branchToDeploy: "master",
            platforms: ["android", "ios"],
            tag: true
        };
        codePushTravis(argv);
        expect(codepushLogin).to.have.callCount(1);
        expect(codePushRelease).to.have.callCount(2);
        expect(codePushRelease.firstCall).to.have.been.calledWithExactly(argv, "android", pkg);
        expect(codePushRelease.secondCall).to.have.been.calledWithExactly(argv, "ios", pkg);
        expect(codepushLogout).to.have.callCount(1);
    });

});
