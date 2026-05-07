"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { FaGithub, FaLinkedin } from "react-icons/fa"

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-center min-h-[70vh]">

          {/* Left Side - Typography */}
          <div
            className={`transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            {/* Huge Name */}
            <h1 className="font-display text-display-xl text-black dark:text-white leading-none mb-4">
              JOHN
              <br />
              <span className="accent-underline">DOE</span>
            </h1>

            {/* Title with accent */}
            <p className="font-display text-display-md text-accent mb-6">
              AI ENGINEER
            </p>

            {/* Divider */}
            <div className="w-24 h-1 bg-black dark:bg-white mb-6" />

            {/* Short Description */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
              Building intelligent systems that solve real problems. 10+ Python libraries. 5 production AI apps.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mb-8">
              <a
                href="https://example.com"
                className="p-3 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"
                aria-label="GitHub"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://example.com"
                className="p-3 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Right Side - Image */}
          <div
            className={`transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"} flex justify-center lg:justify-end`}
          >
            <div className="relative">
              {/* Image with bold border */}
              <div className="w-64 h-80 sm:w-80 sm:h-96 lg:w-96 lg:h-[28rem] border-4 border-black dark:border-white overflow-hidden shadow-bold">
                <Image
                  src="/images/profile.png"
                  alt="John Doe Profile Photo"
                  width={400}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative accent block */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent -z-10" />
            </div>
          </div>
        </div>

        {/* Full Width CTA */}
        <div
          className={`transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} mt-8 lg:mt-0`}
        >
          <Link
            href="/chat"
            className="group flex items-center justify-between w-full p-6 border-4 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"
          >
            <div>
              <h3 className="font-display text-2xl sm:text-3xl">
                CHAT WITH VIRTUAL JOHN DOE
              </h3>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-300 dark:group-hover:text-gray-600 text-sm sm:text-base">
                Explore my experience, projects, and discover what makes me different
              </p>
            </div>
            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
