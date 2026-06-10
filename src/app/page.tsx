import profile from "@/data/profile.json";
import skills from "@/data/skills.json";
import experience from "@/data/experience.json";
import projects from "@/data/projects.json";
import socialLinks from "@/data/social-links.json";
import cv from "@/data/cv.json";
import site from "@/data/site.json";

import { CommandCenterSection } from "@/components/sections/CommandCenterSection";
import { SystemProfileSection } from "@/components/sections/SystemProfileSection";
import { CurrentFocusSection } from "@/components/sections/CurrentFocusSection";
import { CapabilityMatrixSection } from "@/components/sections/CapabilityMatrixSection";
import { OperationalTimelineSection } from "@/components/sections/OperationalTimelineSection";
import { ProjectLabSection } from "@/components/sections/ProjectLabSection";
import { CredentialVaultSection } from "@/components/sections/CredentialVaultSection";
import { ProfessionalCVSection } from "@/components/sections/ProfessionalCVSection";
import { ContactGatewaySection } from "@/components/sections/ContactGatewaySection";

export default function HomePage() {
  const visibleSections = site.ui?.sections ?? {};

  return (
    <>
      <CommandCenterSection profile={profile} cv={cv} />
      {visibleSections.profile !== false && <SystemProfileSection profile={profile} />}
      {visibleSections.focus !== false && <CurrentFocusSection />}
      {visibleSections.skills !== false && <CapabilityMatrixSection skills={skills} />}
      {visibleSections.credentials !== false && <CredentialVaultSection cv={cv} />}
      {visibleSections.experience !== false && <OperationalTimelineSection experience={experience} />}
      {visibleSections.projects !== false && <ProjectLabSection projects={projects} />}
      {visibleSections.cv !== false && <ProfessionalCVSection cv={cv} />}
      {visibleSections.contact !== false && <ContactGatewaySection socialLinks={socialLinks} />}
    </>
  );
}
