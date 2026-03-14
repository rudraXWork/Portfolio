"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type Skill = { name: string; level: number; color: string };

const skillCategories = [
  {
    title: "Frontend",
    emoji: "🎨",
    skills: [
      { name: "React / Next.js", level: 95, color: "from-blue-500 to-cyan-500" },
      { name: "TypeScript", level: 88, color: "from-blue-600 to-blue-400" },
      { name: "Tailwind CSS", level: 92, color: "from-teal-500 to-emerald-500" },
      { name: "Framer Motion", level: 80, color: "from-pink-500 to-rose-500" },
    ],
  },
  {
    title: "Backend",
    emoji: "⚙️",
    skills: [
      { name: "Node.js / Express", level: 90, color: "from-green-500 to-emerald-500" },
      { name: "Python / FastAPI", level: 82, color: "from-yellow-500 to-orange-500" },
      { name: "GraphQL", level: 75, color: "from-pink-500 to-purple-600" },
      { name: "REST APIs", level: 93, color: "from-indigo-500 to-blue-500" },
    ],
  },
  {
    title: "Database",
    emoji: "🗄️",
    skills: [
      { name: "PostgreSQL", level: 85, color: "from-blue-600 to-sky-500" },
      { name: "MongoDB", level: 88, color: "from-green-600 to-green-400" },
      { name: "MySQL", level: 72, color: "from-red-500 to-orange-500" },
      { name: "Prisma ORM", level: 80, color: "from-slate-500 to-gray-500" },
    ],
  },
  {
    title: "DevOps & Tools",
    emoji: "🚀",
    skills: [
      { name: "Docker / K8s", level: 78, color: "from-blue-500 to-cyan-500" },
      { name: "AWS / Vercel", level: 83, color: "from-amber-500 to-orange-500" },
      { name: "Git / GitHub", level: 95, color: "from-gray-600 to-gray-400" },
      { name: "CI/CD Pipelines", level: 76, color: "from-violet-500 to-purple-500" },
    ],
  },
];

const techBadges = [
  "React", "Next.js", "TypeScript", "Node.js", "Python", "Tailwind",
  "PostgreSQL", "MongoDB", "Docker", "AWS", "GraphQL", "Redis",
  "Prisma", "Git", "Figma", "Linux",
];

function SkillBar({ skill, inView }: { skill: Skill; inView: boolean }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-300">{skill.name}</span>
        <span className="text-sm text-indigo-500 font-semibold">{skill.level}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-24 px-4 bg-gray-900/50 relative">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-500 font-medium text-sm uppercase tracking-widest">
            My Skills
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-2">
            Tech{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Stack
            </span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Technologies I work with to bring ideas to life
          </p>
        </motion.div>

        {/* Skill Categories */}
        <div className="grid sm:grid-cols-2 gap-8 mb-16">
          {skillCategories.map((cat, catIdx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + catIdx * 0.1, duration: 0.6 }}
              className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-indigo-500/30 transition-colors"
            >
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                <span>{cat.emoji}</span>
                <span className="text-gray-100">{cat.title}</span>
              </h3>
              {cat.skills.map((skill) => (
                <SkillBar key={skill.name} skill={skill} inView={inView} />
              ))}
            </motion.div>
          ))}
        </div>

        {/* Tech Badge Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-lg font-semibold mb-6 text-gray-300">
            Also familiar with
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {techBadges.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.7 + i * 0.04, duration: 0.3 }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="px-4 py-2 rounded-full bg-gray-900 border border-gray-700 text-sm font-medium text-gray-300 hover:border-indigo-500 hover:text-indigo-400 transition-colors cursor-default shadow-sm"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
