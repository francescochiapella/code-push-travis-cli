import {execSync} from "child_process";

function targetBinary (targetBinary) {
    return targetBinary ? `-t "${targetBinary}"` : "";
}

function appName (pkgName, platform, argv) {
    
    if (argv.na && platform === "android") {
        return `"${argv.na}"`;
    }

    if (argv.ni && platform === "ios") {
        return `"${argv.ni}"`;
    }

    return `"${pkgName}-${platform}"`;
}

function codePushFrameworkRelease (argv, platform, pkg) {
    return [
        "code-push",
        (!argv.framework || argv.framework === "reactnative") ? "release-react" : "release-cordova",
        appName(pkg.name, platform, argv),
        platform,
        `-d "${argv.deploymentName}"`,
        `--des "${argv.description}"`,
        (!argv.framework || argv.framework === "reactnative") ? `--dev ${argv.development}` : "",
        `-m ${argv.mandatory}`,
        targetBinary(argv.targetBinary)
    ].join(" ");
}

function codePushFrameworkReleaseStatus (argv, pkgName, platform) {
    return [
        "code-push",
        "deployment",
        "list",
        appName(pkgName, platform, argv)
    ].join(" ");
}

export default function codePushRelease (argv, platform, pkg) {
    execSync(codePushFrameworkRelease(argv, platform, pkg), {stdio: [0, 1, 2]});
    execSync(codePushFrameworkReleaseStatus(argv, pkg.name, platform), {stdio: [0, 1, 2]});
}
