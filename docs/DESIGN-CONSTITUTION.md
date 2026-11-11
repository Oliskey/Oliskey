OLISKEY MASTER WEBSITE — APPROVED DESIGN CONSTITUTION
1. Overall vision
Build Oliskey as one premium, unified technology headquarters at oliskey.com.
The website must feel like entering a world-class technology company's physical headquarters, not browsing an ordinary SaaS landing page.
The experience must combine:
Premium realistic architecture.
Cinematic 3D environments.
Apple-inspired simplicity and typography.
Natural lighting and realistic materials.
Immersive but understandable interactions.
Excellent loading speed and responsive behaviour.
Avoid generic AI-generated-looking environments, exaggerated holograms, excessive neon, artificial-looking glass panels, random floating objects and unnecessary decoration.
2. Unified website structure
One website with dedicated product destinations:
oliskey.com
oliskey.com/school
oliskey.com/fleet
oliskey.com/alpha
oliskey.com/labs
All pages share the same brand identity, navigation, typography, design tokens, account experience and interaction standards.
3. Brand design system
Primary colours:
Navy
White
Electric blue
Typography:
Inter.
Large, elegant headlines.
Excellent readability.
Generous spacing.
Clear information hierarchy.
Design direction:
Premium realistic architecture.
Clean Apple-inspired layouts.
Subtle futuristic details.
Natural materials, realistic shadows, reflections and lighting.
Consistent buttons, icons, navigation and spacing.
Liquid Glass must be selective. Use it for suitable navigation, floating controls and overlays, never as the default appearance of every surface.
4. Homepage experience
The homepage must begin with a cinematic entrance into the Oliskey headquarters.
The visitor should experience:
A realistic architectural entrance.
A cinematic camera journey into the headquarters.
A premium reception and central showroom.
A clear introduction to Oliskey.
Four discoverable product environments.
Solutions and industry presentations.
Company information and credibility.
A strong account-creation call to action.
Recommended navigation:
Home | Products | Solutions | Industries | Resources | About | Pricing
Actions: Sign in | Get Started.
Primary conversion goal: Create an account.
Never invent customer testimonials, company statistics, certifications or business claims.
5. Individual product environments
Each product must have its own physical 3D environment.
Oliskey School
A realistic premium educational environment featuring modern classrooms, educational displays, school technology and school-management dashboards.
Oliskey Fleet
A realistic transportation and fleet operations environment featuring vehicles, tricycles, transport facilities, tracking displays and operational dashboards.
Oliskey Alpha
A professional financial technology environment featuring trading workstations, market displays, analytics and AI-powered intelligence.
Oliskey Labs
A sophisticated innovation environment featuring AI research facilities, modern technology laboratories and development workspaces.
Every environment must communicate what its product actually does.
Do not reuse one generic showroom for every product.
6. 3D interaction and animation
Use:
Cinematic camera movement.
Scroll-triggered animations.
Seamless transitions between architectural spaces.
Interactive objects and product displays.
Pointer and touch-based exploration.
Subtle depth and parallax.
Carefully controlled motion.
Visitors should be able to explore the environment, click product displays and discover relevant information.
Do not hijack scrolling or make navigation dependent on discovering hidden gestures.
7. Light and dark environments
Light mode represents daytime.
Dark mode represents nighttime.
Both modes must preserve the same architectural identity, layout and product placement.
Change:
Lighting.
Environment maps.
Material appearance.
Window illumination.
Interior lights.
Screen brightness.
Reflections and shadows.
Provide a visible theme switch.
Dark mode must remain highly detailed and readable, not simply a black background.
8. Responsive design
Desktop:
Full cinematic environments.
Wide architectural views.
Interactive product displays.
Smooth camera transitions.
Mobile:
Preserve desktop architectural identity.
Create separately optimized vertical compositions.
Reposition objects intelligently.
Keep important product information visible.
Support touch exploration.
Reduce rendering complexity where necessary.
Mobile must be deliberately designed, not merely a compressed desktop layout.
9. Approved frontend technology direction
Use the following proposed stack:
React / Next.js: Web application framework.
TypeScript: Type safety.
Three.js: 3D rendering.
React Three Fiber: Declarative 3D scenes.
GSAP: Animation and ScrollTrigger.
Blender: Professional 3D modelling and asset preparation.
Tailwind CSS: Responsive styling.
Inter: Primary typography.
Lucide: Interface icons.
Reusable React components: Shared design system.
Inspect the existing repository before choosing or changing the framework. Do not migrate an established working application or introduce unnecessary dependencies without technical justification.
10. Performance engineering
Premium visuals must not compromise usability.
Implement:
Lazy loading of 3D environments.
Optimized GLB/GLTF assets.
Texture compression.
Level of detail.
Adaptive rendering quality.
Efficient lighting and shadows.
Mobile-specific quality settings.
Code splitting.
Image optimization.
Reduced-motion support.
Graceful fallbacks for unsupported devices.
The website must remain usable if WebGL is unavailable.
11. Mandatory frontend skills and agents
Before any frontend implementation, read and apply:
oliskey-apple-quality-frontend.skill.v2.md
apple-hig-research-and-frontend-reasoning.skill.v1.md
oliskey-liquid-glass-complete-design-engineering.skill.md
Use two coordinated agents:
BUILDER:
Inspects the existing project.
Plans the implementation.
Builds the requested interface.
Preserves approved design decisions.
INDEPENDENT VERIFIER:
Inspects the same implementation.
Checks visual quality and functionality.
Tests responsive behaviour.
Checks accessibility and performance.
Can reject the implementation.
Required workflow:
PLAN → BUILD → VERIFY → FIX → VERIFY → PASS.
12. Design approval and consistency
Once a design is approved, treat it as locked.
Do not independently invent new styles for subsequent pages.
Record approved design tokens, components, environments, materials, lighting rules, camera behaviour and responsive patterns in the repository's design documentation.
Every new Oliskey website and product page must follow this constitution unless explicitly approved otherwise.
13. Final quality objective
The finished Oliskey website must feel like a real premium technology headquarters that visitors can explore.
Prioritize:
REALISM + ARCHITECTURE + CLARITY + CINEMATIC EXPERIENCE + CONSISTENCY + PERFORMANCE.
Never sacrifice functionality, readability, accessibility or loading speed for visual effects.
Do not declare work complete without actual implementation and independent verification.