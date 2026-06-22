import type { Metadata } from 'next';
import { getAllProjects } from '@/lib/api';
import TiltCard from '@/components/interactive/TiltCard';

export const revalidate = 3600;
export const metadata: Metadata = { title: 'Work', description: 'Case studies and selected projects by Ray Turk.' };

export default async function WorkPage() {
  const { projects } = await getAllProjects();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-4xl font-semibold">Work</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <TiltCard
            key={project.slug}
            href={`/work/${project.slug}`}
            className="block rounded-xl border border-hairline bg-panel p-6 transition-colors hover:border-ion/40"
          >
            <p className="font-mono text-xs text-ion">case-study/{project.slug}</p>
            <h2 className="mt-2 font-display text-xl font-semibold">{project.title}</h2>
            {project.techStacks?.nodes?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {project.techStacks.nodes.map((tech) => (
                  <span
                    key={tech.slug}
                    className="rounded border border-hairline px-2 py-0.5 font-mono text-[10px] text-faint"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            ) : null}
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
