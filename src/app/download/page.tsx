import { Blocks } from "@/components/page/Blocks";
import { CtaBand } from "@/components/page/CtaBand";
import { OsTabs } from "@/components/page/OsTabs";
import { PageHero } from "@/components/page/PageHero";
import type { Block } from "@/content/types";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Install FoxByte on macOS, Linux or Windows",
  description: "One command installs the fox CLI; a second brings up PostgreSQL 18, branching, the Blackbox and the web console on your own machine.",
  path: "/download",
});

const blocks: Block[] = [
  {
    kind: "grid",
    eyebrow: "Requirements",
    title: "What you need",
    lede: "The first setup takes a few minutes while it downloads the engine and, on macOS and Windows, a Linux image. Offline and air-gapped installs aren’t supported yet: the installer fetches the CLI from GitHub releases and the engine images from GHCR.",
    items: [
      { title: "macOS", body: "Apple silicon or Intel. Lima runs the local Linux VM (brew install lima); Docker and ZFS are set up inside it for you.", icon: "db" },
      { title: "Linux", body: "arm64 or amd64, run with sudo. ZFS and Docker are provisioned the first time the engine starts.", icon: "box" },
      { title: "Windows", body: "Windows 10 21H2 or later, or Windows 11, with virtualisation enabled. WSL is installed if it is missing, with a dedicated distro on btrfs.", icon: "pulse" },
    ],
  },
  {
    kind: "steps",
    eyebrow: "After install",
    title: "Your first five minutes",
    items: [
      { title: "The console opens", body: "https://localhost:8080 opens by itself with a one-time setup token in the link. Choose an email and a password." },
      { title: "Make an API key", body: "On the API keys page, or fox apikey create. The key is the password in your connection string." },
      { title: "Branch", body: "main already has three sample tables. fox branch create qa gives you a copy to break." },
      { title: "Check the install", body: "fox check says whether everything is healthy, and what to run when something is not." },
    ],
  },
  {
    kind: "code",
    eyebrow: "Verify a release",
    title: "Know what you installed",
    body: "Every release’s SHA256SUMS is signed with the FoxByte release key, which the installer checks where OpenSSL can. Each file has a GitHub build attestation, and each release an SBOM.",
    lines: ["$ gh attestation verify fox-darwin-arm64 --repo thefoxbyte/foxbyte"],
    note: "The release key’s fingerprint is on the Security page. On macOS, set FOX_REQUIRE_SIGNATURE=1 to stop rather than warn when the signature cannot be checked.",
  },
  {
    kind: "code",
    eyebrow: "Updates",
    title: "The one call home, and how to turn it off",
    body: "fox start asks GitHub whether a newer release exists. It sends nothing about your data. Turn it off for good with one setting.",
    lines: ["$ export FOX_NO_UPDATE_CHECK=1"],
  },
  {
    kind: "code",
    eyebrow: "Enterprise",
    title: "Install the Enterprise edition",
    body: "The same engine with the Enterprise features compiled in. Without a licence it behaves exactly like Standard, and you can switch an existing install in place.",
    lines: [`$ ${site.install.replace(/\| sh$/, "| FOX_EDITION=enterprise sh")}`, "$ fox upgrade --edition enterprise"],
  },
  {
    kind: "code",
    eyebrow: "From source",
    title: "Build it yourself",
    body: "For contributors. Set FOX_NO_REFRESH=1 when running fox setup from a source build, so it keeps your local engine.",
    lines: ["$ make build", "$ make vm-build", "$ FOX_NO_REFRESH=1 fox setup"],
  },
];

export default function DownloadPage() {
  return (
    <>
      <PageHero
        hero={{
          eyebrow: "Download",
          title: "Install FoxByte",
          lede: "One command installs the fox CLI. A second brings up PostgreSQL 18, branching, the Blackbox and the console, in a few minutes the first time. Day to day, everything is a fox command on every system.",
        }}
        trail={[{ label: "Download", href: "/download" }]}
      />
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <OsTabs />
        </div>
      </section>
      <Blocks blocks={blocks} />
      <CtaBand
        title="Need a hand getting started?"
        lede="The quickstart walks through connecting your app, making keys and your first branch."
        related={[
          { label: "Docs", href: "/docs" },
          { label: "Pricing", href: "/pricing" },
          { label: "Security", href: "/security" },
        ]}
      />
    </>
  );
}
