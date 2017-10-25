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

function reactNativeRelease (argv, platform, pkg) {
    return [
        "code-push",
        "release-react",
        appName(pkg.name, platform, argv),
        platform,
        `-d "${argv.deploymentName}"`,
        `--des "${argv.description}"`,
        `--dev ${argv.development}`,
        `-m ${argv.mandatory}`,
        targetBinary(argv.targetBinary)
    ].join(" ");
}

function reactNativeReleaseStatus (argv, pkgName, platform) {
    return [
        "code-push",
        "deployment",
        "list",
        appName(pkgName, platform, argv)
    ].join(" ");
}

export default function codepushReleaseReact (argv, platform, pkg) {
    execSync(reactNativeRelease(argv, platform, pkg), {stdio: [0, 1, 2]});
    execSync(reactNativeReleaseStatus(argv, pkg.name, platform), {stdio: [0, 1, 2]});
}
