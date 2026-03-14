"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Code2, Palette, Rocket, Users } from "lucide-react";

const highlights = [
  { icon: Code2, label: "Clean Code", desc: "I write maintainable, well-structured code." },
  { icon: Palette, label: "Great Design", desc: "I care deeply about UX & visual polish." },
  { icon: Rocket, label: "Fast Delivery", desc: "I ship products quickly without cutting corners." },
  { icon: Users, label: "Team Player", desc: "Collaborative, communicative, and helpful." },
];

// const stats = [
//   { value: "3+", label: "Years Experience" },
//   { value: "50+", label: "Projects Built" },
//   { value: "20+", label: "Happy Clients" },
//   { value: "10+", label: "Technologies" },
// ];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-16 px-4 relative">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-indigo-500 font-medium text-sm uppercase tracking-widest">About Me</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-2">
            Who I{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Am
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image / Avatar Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border-4 border-indigo-500/30 shadow-2xl shadow-indigo-500/20">
                {/* Your avatar image */}
                <Image
                  src="/image.png"
                  alt="Your avatar"
                  width={320}
                  height={320}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              {/* Decorative rings */}
              <div className="absolute -inset-4 rounded-2xl border-2 border-indigo-500/10" />
              <div className="absolute -inset-8 rounded-2xl border border-purple-500/5" />
              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -bottom-4 -right-4 bg-gray-900 rounded-2xl px-4 py-3 shadow-xl shadow-black/10 border border-gray-800"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm font-medium">Open to Work</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-100">
              Full Stack Developer & Data Analyst based in India 🇮🇳
            </h3>
            <p className="text-gray-400 leading-relaxed mb-4">
             I am a passionate developer who enjoys building modern web applications and exploring data-driven solutions. I specialize in React, Next.js, Node.js, and cloud-based technologies, developing full-stack systems that are efficient, scalable, and user-friendly.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              Alongside web development, I work with data analysis to transform raw data into meaningful insights. I enjoy learning new technologies, building projects, and continuously improving my technical skills.
            </p>

            {/* Stats */}
            {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                  className="text-center p-3 rounded-xl bg-gray-900 border border-gray-800"
                >
                  <div className="text-2xl font-bold text-indigo-500">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div> */}
          </motion.div>
        </div>

        {/* Highlights */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {highlights.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
              className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-900/40 flex items-center justify-center mb-4 group-hover:bg-indigo-500 transition-colors">
                <item.icon className="w-6 h-6 text-indigo-400 group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-semibold text-gray-100 mb-1">{item.label}</h4>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
