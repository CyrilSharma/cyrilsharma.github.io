#import "/typ/templates/blog.typ": *
#show: main.with(
  title: "Orgo",
  desc: "",
  date: "2026-05-30T16:31:30-04:00",
  tags: ("chem",),
)

I'm going through #link("https://yustikaforict.wordpress.com/wp-content/uploads/2012/12/organic_chemistry_4th_ed_-_francis_a-_carey-291.pdf")[this textbook], which UC Davis uses.

*Bonding*: Bonds are roughly what happens when electron wave-functions overlap constructively. These wave-functions can be represented as a sum of _orbitals_, which are shaped like spheres, dumb-bell shapes, etc. Only two electrons can sit in a given orbital.
+ We only have analytic solutions for the orbitals of a Hydrogen atom. Electron-electron interactions remove the analytic tractability.
+ Hence, the orbitals you see for other atoms are technically of slightly different shapes, and must be computed numerically.
+ "Orbitals" are defined as the eigenfunctions of the Hamiltonian. A valid wave-function merely has to be a normalized, linear combination of orbitals.
+ It's important to distinguish orbitals from wave-functions. There's an infinite number of orbitals, and they always exist. Whether an electron uses some combination of them is a function of the energy and interactions of the system.
+ Hybridization is really best understood as not some mixture of S and P orbitals, but simply the wave-function electrons take on under certain circumstances. Historically, we knew Carbon could make four equal-strength bonds in a Tetrahedron shape, and Hybridization is a way to describe those bonds.
+ There are three main theories of bonding. There's Lewis structures which require everything atom to fill its valence shell, there's Valence-Bond theory which adds some more nuance like the actual bond type, and there's Molecular Orbit Theory, which allows a single electron's density to interact with multiple atoms.
+ Resonance is essentially Valence-Bond theories attempt to work with electrons that are fundamentally not localized to a single atom.

In a nutshell, molecules are just blobs of electron density which are more than the super-impositions of their pieces, but this is too complex a picture for humans so we prefer to imagine electrons only interface between pairs of atoms, and make corrections when needed.

// Aliphatic: Hydrocarbons that looked like Fat, Aromatic: Hydrocarbons obtained from nice smelling plants.
// Methane / Ethane / Propane, super simple!
// Fuel oil is very different from biological oil.
// Combustion is simple.
// Oxidation-Reduction