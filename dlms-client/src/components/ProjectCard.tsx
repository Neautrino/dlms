import { motion } from 'framer-motion'
import React from 'react'

function ProjectCard() {
  return (
    <motion.div
            key={project.id}
            variants={item}
            className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
              <Button variant="outline">View Details</Button>
            </div>

            <div className="flex gap-6 mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span>{project.budget}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{project.timeframe}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>{project.applicants} applicants</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </motion.div>
  )
}

export default ProjectCard