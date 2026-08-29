const articles = [
  {
    id: 1,
    category: "Science",
    readTime: "7 min read",
    date: "July 16, 2026",

    title: "How CRISPR Is Rewriting the Story of Human Disease",

    description:
      "A quiet revolution in molecular biology has produced a tool precise enough to correct a single letter in the three-billion-character book of human DNA.",

    author: {
      name: "Priya Mehta",
      bio: "Science communicator and molecular biologist.Writing about the invisible world.",
    },

    stats: {
      views: 4821,
      likes: 284,
    },
    img: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=600&fit=crop&auto=format",
    content: `
The laboratory is a place of carefully managed uncertainty. For Priya Mehta, a morning at the bench begins not with pipettes and PCR machines, but with a kind of reckoning — with what might work, what might fail, and what could change everything.

CRISPR-Cas9, the gene-editing system that has dominated biology headlines since 2012, is now moving from bench to bedside with a speed that startles even its pioneers. In late 2023, the FDA approved the first CRISPR-based therapy for sickle cell disease, marking a turning point that many researchers thought was still a decade away.

### What CRISPR Actually Does

At its core, CRISPR is a bacterial immune system repurposed as a molecular scalpel. Bacteria use it to recognize and cut viral DNA — a kind of biological memory. Scientists learned to program the system with a guide RNA, directing the Cas9 protein to any target sequence in a genome with remarkable specificity.

The repair mechanisms cells then activate can disable a gene, correct a mutation, or insert new genetic material. The possibilities are constrained mainly by what we understand about disease — which is to say, they are constrained, but not for much longer.

### The Road to the Clinic

Sickle cell disease — caused by a single point mutation in the HBB gene — proved an ideal early target. Correcting that mutation, or activating fetal hemoglobin to compensate for it, is now achievable with durable results in clinical trials.Patients who received the therapy have remained free of the debilitating pain crises that once defined their lives.

The story does not end there. Trials are underway for Duchenne muscular dystrophy, several forms of hereditary blindness, and certain cancers. The pace is accelerating.

### The Ethical Terrain

The technology's promise does not arrive without weight. Germline editing — modifying embryos so that changes pass to future generations — remains deeply controversial and is effectively banned in most jurisdictions.The 2018 birth of CRISPR-edited babies in China, announced by He Jiankui, produced a global condemnation that has shaped regulatory conversations ever since.

Where somatic editing treats one person, germline editing would alter a lineage. The distinction matters enormously, and the scientific community's consensus is clear: the tools are not yet safe or precise enough for heritable modification, and the ethical frameworks for such decisions do not yet exist.

### What Comes Next

Base editing and prime editing — successor technologies that operate without cutting the double helix entirely — promise even greater precision with fewer unintended consequences. They are arriving in clinical trials as CRISPR's first wave of therapies matures.

The story of molecular medicine is being rewritten not in metaphor but in sequence. Nucleotide by nucleotide, the boundary between diagnosis and cure is moving.
`,

    tags: ["biology", "medicines", "genetics"],
    quizname: "Test Your CRISPR Knowledge — 3 questions",
  },

  {
    id: 2,
    category: "Technology",
    readTime: "6 min read",
    date: "July 30, 2026",

    title: "The Night the Internet Was Born — and Almost Wasn't",

    description:
      "On October 29, 1969, a student typed two letters into a terminal at UCLA. The system crashed. The internet had arrived.",

    author: {
      name: "Thomas Okeke",
      bio: "Historian of technology.Former editor at Nature. Coffee enthusiast.",
    },

    stats: {
      views: 3104,
      likes: 198,
    },
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop&auto=format",
    content: `
The message was supposed to be "login." What arrived, 400 miles away at the Stanford Research Institute, was "lo." Then the system crashed.

It was 10:30 p.m. on October 29, 1969, and in that brief, broken transmission, the ARPANET had said its first word. The modern internet — the thing you are reading this on — traces its lineage to that stutter.

### Why ARPANET Existed

The Advanced Research Projects Agency Network was not built to survive nuclear war, despite the myth. It was built to let university researchers share computing resources — the ARPA-funded time-sharing systems that existed, expensive and scattered, at a handful of institutions.

The key innovation was packet switching: instead of dedicating a circuit to a conversation, as telephone networks did, ARPANET broke data into discrete packets, sent them independently, and reassembled them at the destination.No single point of failure. No reserved bandwidth. Just packets, finding their way.

### The Nodes

By the end of 1969, four nodes existed: UCLA, Stanford Research Institute, UC Santa Barbara, and the University of Utah.Each ran an Interface Message Processor — a dedicated minicomputer built by Bolt Beranek and Newman — that handled the packet routing so the host machines didn't have to.

By 1971, there were 15 nodes. By 1973, the network had crossed the Atlantic. By 1983, the protocol had changed — TCP/IP replaced the original NCP — and what had been ARPANET was becoming something bigger than its architects imagined.

### What They Got Wrong

The designers of ARPANET optimized for resilience and resource sharing. They did not design for scale, for commerce, for anonymity, for mass surveillance, or for the particular social dynamics that emerge when three billion humans interact continuously through a shared medium.

This is not a criticism. It is a reminder. The infrastructure we inherited was built for a world of trusted research nodes. The world it now serves is considerably stranger.

### A Network Becomes a Medium

The transformation from ARPANET to internet to web happened in stages, each adding a layer of abstraction.TCP/IP standardized the transport. DNS gave machines names humans could read. HTTP gave documents addresses. The browser gave those documents windows.

The rest is the particular texture of the world you live in now — the feeds, the searches, the messages, the commerce — built on a foundation laid by a crash and a two-letter word.
`,

    tags: ["history", "internet", "computing"],
    quizname: "The Early Internet — Fact or Fiction? — 2 questions",
  },
];

export default articles;
