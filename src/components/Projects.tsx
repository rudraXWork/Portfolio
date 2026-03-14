"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

type Project = {
  title: string;
  description: string;
  tags: string[];
  github: string;
  live: string;
  gradient: string;
  image: string;
  featured?: boolean;
};

const allProjects: Project[] = [
  {
    title: "SkinGuard AI",
    description:
      "SkinGuard AI allows users to upload skin lesion images through a web interface. The image is processed by a deep learning model on the backend, which predicts whether the lesion is cancerous or non-cancerous.",
    tags: ["React.js", "JavaScript", "sqlite", "FastAPI", "Keras"],
    github: "https://github.com/rudraXWork/SkinGuard_Ai",
    live: "https://example.com",
    gradient: "from-blue-500 to-cyan-500",
    image: "/SkinGuard.png",
    featured: true,
  },
  {
    title: "Enginews",
    description:
      "A dynamic news website integrated with a SpotFake feature that detects fake news using Machine Learning and NLP.",
    tags: ["React", "Node.js", "NLP", "BERT "],
    github: "https://github.com/rudraXWork/Enginews",
    live: "https://enginews.onrender.com/",
    gradient: "from-violet-500 to-purple-600",
    image: "/Enginews.png",
    featured: true,
  },
  {
    title: "Motion",
    description:
      "The Motion is a modern React.js project bootstrapped with Vite and enhanced with animation effects using Framer Motion",
    tags: ["React", "Tailwind ", "Framer-motion", "vite"],
    github: "https://github.com/rudraXWork/Motion",
    live: "https://rudraxwork.github.io/Motion/",
    gradient: "from-orange-500 to-red-500",
    image: "/motion.png",
    featured: true,
  },
];

// Filter functionality - commented out for future use
// const filterTags = ["All", "Next.js", "React", "Node.js", "TypeScript", "MongoDB", "PostgreSQL"];

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-500 font-medium text-sm uppercase tracking-widest">
            My Work
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-2">
            Featured{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Full-stack solutions combining cutting-edge technologies with real-world problem solving
          </p>
        </motion.div>

        {/* Filter Pills - Commented out for future use */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {filterTags.map((tag) => (
            <motion.button
              key={tag}
              onClick={() => setFilter(tag)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === tag
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-gray-900 border border-gray-700 text-gray-400 hover:border-indigo-400"
              }`}
            >
              {tag !== "All" && <Tag className="w-3 h-3" />}
              {tag}
            </motion.button>
          ))}
        </motion.div> */}

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 "
        >
          {allProjects.map((project, i) => (
            <motion.div
              key={project.title}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              className="group relative bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 transition-all hover:scale-105"
            >
              {/* Project Preview Banner */}
              <div className={`h-36 bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}>
                <Image
                  src={project.image}
                  alt={project.title}
                  width={400}
                  height={144}
                  className="w-full h-full object-contain opacity-90 hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {project.featured && (
                  <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium z-10">
                    Featured
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6 ">
                <h3 className="font-bold text-lg mb-2 text-gray-100 group-hover:text-indigo-500 transition-colors ">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-indigo-900/30 text-indigo-400 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-400 transition-colors font-medium"
                    whileHover={{ x: 2 }}
                  >
                    <Github className="w-4 h-4" />
                    Code
                  </motion.a>
                  {project.live !== "https://example.com" && (
                    <motion.a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-400 transition-colors font-medium"
                      whileHover={{ x: 2 }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* More CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/rudraXWork"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-indigo-500 text-indigo-400 font-medium hover:bg-indigo-900/20 transition-colors"
          >
            <Github className="w-4 h-4" />
            View All on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
