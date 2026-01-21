"use client";

import * as React from "react";
import Link from "next/link";
import {
  Facebook,
  Youtube,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Shield,
  HelpCircle,
  FileText,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Về KeyMarket",
      links: [
        { href: "#about", label: "Giới thiệu" },
        { href: "#news", label: "Tin tức Game" },
        { href: "#recruitment", label: "Tuyển dụng" },
        { href: "#contact", label: "Liên hệ" },
      ],
    },
    {
      title: "Hỗ trợ",
      links: [
        { href: "#instructions", label: "Hướng dẫn mua hàng" },
        { href: "#faq", label: "Câu hỏi thường gặp" },
        { href: "#terms", label: "Điều khoản sử dụng" },
        { href: "#privacy", label: "Chính sách bảo mật" },
      ],
    },
    {
      title: "Dịch vụ",
      links: [
        { href: "#game-keys", label: "Game Keys" },
        { href: "#software", label: "Bản quyền phần mềm" },
        { href: "#gift-cards", label: "Thẻ quà tặng" },
        { href: "#topup", label: "Nạp tiền game" },
      ],
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "#",
      icon: Facebook,
    },
    {
      name: "YouTube",
      href: "#",
      icon: Youtube,
    },
    {
      name: "Zalo",
      href: "#",
      icon: MessageCircle,
    },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-background/55 backdrop-blur-xl mt-20">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-20" />
      
      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              href="/"
              className="group flex items-center gap-2 rounded-xl px-2 py-1 w-fit"
            >
              <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500/40 via-fuchsia-500/25 to-cyan-400/25 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                <span className="text-base font-black tracking-tight text-white">
                  K
                </span>
                <span className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-br from-violet-500/30 via-fuchsia-500/10 to-cyan-400/20 opacity-0 blur-md transition group-hover:opacity-100" />
              </div>
              <div className="leading-tight">
                <div className="text-base font-extrabold tracking-tight text-foreground">
                  KeyMarket
                </div>
                <div className="text-xs text-muted-foreground">Thị trường số</div>
              </div>
            </Link>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              Thị trường hiện đại cho game key, bản quyền phần mềm, thẻ quà tặng và nạp tiền.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a
                  href="mailto:support@keymarket.vn"
                  className="hover:text-foreground transition-colors"
                >
                  support@keymarket.vn
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a
                  href="tel:19001234"
                  className="hover:text-foreground transition-colors"
                >
                  1900 1234
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Việt Nam</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl",
                      "bg-white/5 border border-white/10",
                      "text-muted-foreground hover:text-foreground",
                      "hover:bg-white/10 hover:border-white/20",
                      "transition-all duration-200"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-bold text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-sm text-muted-foreground",
                        "hover:text-foreground transition-colors",
                        "inline-flex items-center gap-1.5"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span>© {currentYear} KeyMarket. Bảo lưu mọi quyền.</span>
              <span className="hidden sm:inline">•</span>
              <Link
                href="#terms"
                className="hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                <FileText className="h-3 w-3" />
                Điều khoản
              </Link>
              <span>•</span>
              <Link
                href="#privacy"
                className="hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                <Shield className="h-3 w-3" />
                Bảo mật
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
