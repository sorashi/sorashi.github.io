---
layout: post
title: Asus E200HA Arch Linux Installation Guide
description: How to install Arch Linux on Asus E200HA
slug: asus-e200ha-arch
date: 2020-02-01
lastmod: 2021-06-06
---

## Foreword

Oh, the Asus E200HA! A small Intel Cherry Trail netbook with 32GB of internal memory and
2 gigs of RAM. I bought one for its compact size and small weight. Boy, was
it a mistake. It comes with Windows 10 pre-installed and Windows 10 sure likes
huge updates and general littering of your drive. The device is literally unusable after a small while. That is not a huge
deal, you can just install Linux, right? It wasn't that easy. At the time I
bought the device, Linux kernel hadn't integrated drivers for its network card,
audio card and SD card reader. Some people even reported they couldn't get their touch-pad
to work, or that the backlight control didn't work. Intel Cherry Trail CPU series
support was also stuttering, because of problems with power saving - the purpose
of Cherry Trail processors.

Hopeless as it may seem, there are incredible people working on the Linux kernel
every day and fighting against the powerful wave of proprietary devices that receive drivers only for Windows (some people suggest Windows may have contracts and does this intentionally so that people don't use other systems, but that's a conspiration-sounding statement). And they eventually managed to fix these problems (by version 5.3). But user-friendly
Linux distributions do not update their kernel until it's thoroughly tested. So
there have been
[attempts](https://github.com/Grippy98/Asus-E200HA-Linux-Post-Install-Script) at
creating a script that would update the kernel and force some new drivers to be
used, but I never managed to make audio work using the script.

When Ubuntu 19.04 came around, the required kernel version was built in and
supported. So I tried again. Audio still didn't work, but I [found out](https://github.com/heikomat/linux/tree/cx2072x/cx2072x_fixes_and_manual)
that the system isn't configured to use (or recognize?) the audio card. And so I finally managed to get audio working. Eventually I realized that Ubuntu is still too big of a system for this timid device. Furthermore, kernel 5.3 had some problems with the graphics chip that ships with Cherry Trail devices, making your screen freeze and forcing you to hard-reset.

And so I decided to install Arch. Because Arch lets you install just what you want and because Arch usually has bleeding-edge kernel. And since installing Arch is not completely user-friendly I decided to make a small guide (or rather a log) specifically for this device. I don't guarantee it will work and I'm not responsible for any damages you may cause to your device. It's actually just a record of what I did for a successful install at the time.

Good luck and have fun!

*Warning: As of late February 2020 there seem to be screen freezing issues.*

Looks like **Linux Mint latest edition 20 Ulyana - Cinnamon 64** works out of the box for this device! Thank you Badd Pitt for your [comment](http://disq.us/p/2d7jp8j).

## Booting

I used Rufus on Windows to burn `archlinux-2019.12.01-x86_64.iso` to a drive in ISO mode.

Start E200HA and press F1 or F2 repeatedly until you're shown the BIOS menu. Move to boot options and specify the USB drive as the first option. Then save and exit.

## First Wi-Fi connection

I needed to connect to eduroam (a global Wi-Fi network for educational institutions), which uses WPA-EAP. If you have access to a classic Wi-Fi, use `wifi-menu` to connect.

- To connect to eduroam, create `wpa_supplicant` config file: `vi wpa_supplicant.conf`

```text
ctrl_interface=/run/wpa_supplicant
update_config=1
# ^ these two lines may not be needed
network={
  ssid="eduroam"
  key_mgmt=WPA-EAP
  eap=PEAP
  phase2="none"
  identity="*username*"
  password="*password*"
}
```

- check if `wlan0` interface exists: `ip link`
- see if you can connect to eduroam: `wpa_supplicant -i wlan0 -c wpa_supplicant.conf`
- cancel the process if the connection was successful; run it in background as a daemon: `wpa_supplicant -B -i wlan0 -c wpa_supplicant.conf`
- `dhcpcd` to get your ip
- `ping google.com` to check connection

## Installation

Use `cfdisk /dev/mmcblk0` to create (in this order)

```text
300M EFI Filesystem
  1G Linux swap
rest Linux filesystem
```

```bash
mkfs.fat -F32 /dev/mmcblk0p1
mkswap /dev/mmcblk0p2
mkfs.ext4 /dev/mmcblk0p3
mount /dev/mmcblk0p3 /mnt
swapon /dev/mmcblk0p2
```

Edit mirrorlist to have your preferred mirrors at the top
```vi /etc/pacman.d/mirrorlist```

```bash
pacstrap /mnt base base-devel linux linux-firmware
genfstab -U -p /mnt >> /mnt/etc/fstab
arch-chroot /mnt
```

Choose a hostname

```bash
echo your_hostname > /etc/hostname
```

Uncomment `en_US.UTF-8 UTF-8` and `en_US ISO-8859-1`

```bash
pacman -S vim
vim /etc/locale.gen
locale_gen
echo LANG=en_US.UTF-8 > /etc/locale.conf
export LANG=en_US.UTF-8
```

Find your zone in `/usr/share/zoneinfo/` using `ls` and then

```bash
ln -s /usr/share/zoneinfo/Europe/Prague /etc/localtime
hwclock --systohc --utc
passwd
useradd -mg users -G wheel -s /bin/bash your_username
passwd your_username
pacman -S dhcp dhcpcd wpa_supplicant dialog netctl sudo
vim /etc/sudoers # uncomment %wheel ALL=(ALL) ALL
```

Now to the bootloader!

```bash
pacman -S grub efibootmgr dosfstools os-prober mtools
mkdir /boot/EFI
mount /dev/mmcblk0p1 /boot/EFI
grub-install --target=x86_64-efi --bootloader-id=grub_uefi --recheck
grub-mkconfig -o /boot/grub/grub.cfg
exit
umount -a
telinit 6
```

After reboot:
Connect to wifi either using wifi-menu or create a profile in /etc/netctl then

```bash
sudo ip link _ down # _ is your interface, find it using ip
sudo netctl start profile_name
sudo dhcpcd
```

Install xorg server

```bash
sudo pacman -S xf86-video-intel xorg-server-xephyr
```

Now install your desired display manager, desktop environment and terminal, for example

```bash
pacman -S lightdm i3-gaps dmenu i3-status rxvt-unicode
sudo systemctl enable lightdm
reboot
```

Congratulations! Now go have fun and make your system comfortable. Be sure to comment if you found a mistake, have problems or just want to add something.

---

What I personally installed after that:

```bash
pacman -S yay git ranger
yay powerline-fonts-git # then use "DejaVu Sans Mono for Powerline" font in your terminal
yay rxvt-unicode-pixbuf
```

I might add other things later 🙂

[1]: https://www.tecmint.com/arch-linux-installation-and-configuration-guide/
