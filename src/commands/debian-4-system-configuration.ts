import { Command } from "../model/command.ts";
import { hostname } from "./hostname.ts";
import { networkInterface } from "./network-interface.ts";
import { aptSourcesListMnt } from "./apt-sources-list-mnt.ts";
import { FileSystemPath } from "../model/dependency.ts";
import { ROOT } from "../os/user/root.ts";
import {
  chrootBasicSystemEnvironment,
} from "./chroot-basic-system-environment.ts";
import { chrootZfs } from "./chroot-zfs.ts";
import { chrootGrub } from "./chroot-grub.ts";
import { chrootPasswdRoot } from "./chroot-passwd-root.ts";
import { chrootZfsBpool } from "./chroot-zfs-bpool.ts";
import { chrootTmpfs } from "./chroot-tmpfs.ts";
import { chrootSsh } from "./chroot-ssh.ts";
import { chrootDropbearRemoteUnlocking } from "./chroot-dropbear-remote-unlocking.ts";
import { debian3SystemInstallation } from "./debian-3-system-installation.ts";
import { getDisks } from "../os/find-disk.ts";
import { chrootProxmox } from "./chroot-proxmox.ts";

export const debian4SystemConfiguration = Command.custom(
  "debian4SystemConfiguration",
)
  .withLocks((await getDisks()).map((disk) => FileSystemPath.of(ROOT, disk)))
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
    chrootProxmox,
  ]);
