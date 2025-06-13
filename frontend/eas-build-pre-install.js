// eas-build-pre-install.js

export default async function preInstallHook({ utils }) {
  await utils.run("npm install --legacy-peer-deps");
}
