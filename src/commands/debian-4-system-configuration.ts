import { Command } from "../model/command.ts";
import { hostname } from "./hostname.ts";
import { networkInterface } from "./network-interface.ts";
import { aptSourcesListMnt } from "./apt-sources-list-mnt.ts";
import { FileSystemPath } from "../model/dependency.ts";
import { ROOT } from "../os/user/root.ts";
import { config } from "../config.ts";
import { chrootBasicSystemEnvironment } from "./chroot-basic-system-environment.ts";
import { chrootZfs } from "./chroot-zfs.ts";
import { chrootGrub } from "./chroot-grub.ts";
import { chrootPasswdRoot } from "./chroot-passwd-root.ts";
import { chrootZfsBpool } from "./chroot-zfs-bpool.ts";
import { chrootTmpfs } from "./chroot-tmpfs.ts";
import { chrootSsh } from "./chroot-ssh.ts";
import { chrootDropbearRemoteUnlocking } from "./chroot-dropbear-remote-unlocking.ts";
import { debian3SystemInstallation } from "./debian-3-system-installation.ts";
import { getDisk } from "../os/find-disk.ts";

export const debian4SystemConfiguration = Command.custom()
  .withLocks([FileSystemPath.of(ROOT, await getDisk())])
  .withDependencies([
    debian3SystemInstallation,
    hostname,
    networkInterface,
    aptSourcesListMnt,
    chrootBasicSystemEnvironment,
    chrootZfs,
    chrootGrub,
    chrootPasswdRoot,
    chrootZfsBpool,
    chrootTmpfs,
    chrootSsh,
    chrootDropbearRemoteUnlocking,
  ]);
