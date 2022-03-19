import {
  chrootBasicSystemEnvironment,
  inChrootPrefix,
} from "./chroot-basic-system-environment.ts";
import { getFirstDisk } from "../os/find-disk.ts";
import { Command, Sequential } from "../model/command.ts";
import { ensureSuccessful, ensureSuccessfulStdOut } from "../os/exec.ts";
import { ROOT } from "../os/user/root.ts";
import { LineInFile } from "./common/file-commands.ts";
import { FileSystemPath } from "../model/dependency.ts";
import { chrootZfs } from "./chroot-zfs.ts";
import { debian3SystemInstallation } from "./debian-3-system-installation.ts";
import { hostname } from "./hostname.ts";
import { networkInterface } from "./network-interface.ts";
import { aptSourcesListMnt } from "./apt-sources-list-mnt.ts";
import { inChrootCommand } from "./in-chroot-command.ts";

const chrootGrubInstallDosfsTools = inChrootCommand(
  "chrootGrubInstallDosfsTools",
  `apt install -y dosfstools`,
)
  .withSkipIfAll([
    async () => {
      await ensureSuccessful(
        ROOT,
        inChrootPrefix("dpkg --status dosfstools"),
      );
      return true;
    },
  ]);

const chrootGrubMkfsEfiPart2 = inChrootCommand(
  "chrootGrubMkfsEfiPart2",
  `mkdosfs -F 32 -s 1 -n EFI ${await getFirstDisk()}-part2`,
)
  .withSkipIfAll([
    async () => {
      await ensureSuccessful(
        ROOT,
        inChrootPrefix(`file -sL ${await getFirstDisk()}-part2 | grep EFI`),
      );
      return true;
    },
  ]);

const chrootGrubMkdirBootEfi = inChrootCommand(
  "chrootGrubMkdirBootEfi",
  `mkdir /boot/efi`,
)
  .withSkipIfAll([
    async () => {
      await ensureSuccessful(
        ROOT,
        inChrootPrefix(`[ -d /boot/efi ]`),
      );
      return true;
    },
  ]);

const chrootGrubLineInFstab = Command.custom("chrootGrubLineInFstab").withRun(
  async (): Promise<[Command]> => {
    const uuid = await ensureSuccessfulStdOut(ROOT, [
      ..."blkid -s UUID -o value".split(" "),
      await getFirstDisk() + "-part2",
    ]);
    return [
      new LineInFile(
        ROOT,
        FileSystemPath.of(ROOT, "/mnt/etc/fstab"),
        `/dev/disk/by-uuid/${uuid} /boot/efi vfat defaults 0 0`,
      ),
    ];
  },
);

const chrootGrubMountBootEfi = inChrootCommand(
  "chrootGrubMountBootEfi",
  `mount /boot/efi`,
)
  .withSkipIfAll([
    async () => {
      await ensureSuccessful(
        ROOT,
        inChrootPrefix(`findmnt ${await getFirstDisk()}-part2`),
      );
      return true;
    },
  ]);

const chrootGrubInstallGrub = inChrootCommand(
  "chrootGrubInstallGrub",
  `apt install -y grub-efi-amd64`,
)
  .withSkipIfAll([
    async () => {
      await ensureSuccessful(
        ROOT,
        inChrootPrefix("dpkg --status grub-efi-amd64"),
      );
      return true;
    },
  ]);

const chrootGrubInstallShimSigned = inChrootCommand(
  "chrootGrubInstallShimSigned",
  `apt install -y shim-signed`,
)
  .withSkipIfAll([
    async () => {
      await ensureSuccessful(
        ROOT,
        inChrootPrefix("dpkg --status shim-signed"),
      );
      return true;
    },
  ]);

const chrootGrubRemoveOsProber = inChrootCommand(
  "chrootGrubRemoveOsProber",
  `apt purge -y os-prober`,
)
  .withSkipIfAll([
    async () => {
      await ensureSuccessful(
        ROOT,
        inChrootPrefix("! dpkg --status os-prober"),
      );
      return true;
    },
  ]);

export const chrootGrub = new Sequential("chrootGrub", [
  chrootGrubInstallDosfsTools,
  chrootGrubMkfsEfiPart2,
  chrootGrubMkdirBootEfi,
  chrootGrubLineInFstab,
  chrootGrubMountBootEfi,
  chrootGrubInstallGrub,
  chrootGrubInstallShimSigned,
  chrootGrubRemoveOsProber,
])
  .withDependencies([
    debian3SystemInstallation,
    hostname,
    networkInterface,
    aptSourcesListMnt,
    chrootBasicSystemEnvironment,
    chrootZfs,
  ]);
