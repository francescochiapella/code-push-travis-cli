import codepushLogin from "./steps/login";
import codePushRelease from "./steps/release-react";
import codepushLogout from "./steps/logout";

export default function codePushTravis (argv) {
    if ((
        (argv.tag ? process.env.TRAVIS_TAG : false) || process.env.TRAVIS_BRANCH === argv.branchToDeploy
    ) && process.env.TRAVIS_PULL_REQUEST === "false") {
        const pkg = require(`${process.env.TRAVIS_BUILD_DIR}/package.json`);
        codepushLogin();
        argv.platforms.forEach(platform => codePushRelease(argv, platform, pkg));
        codepushLogout();
    }
}
