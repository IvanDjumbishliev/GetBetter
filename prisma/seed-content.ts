type QuestionSeed = [
  question: string,
  options: [string, string, string, string],
  correctIndex: number,
  explanation: string,
];

interface LessonSeed {
  title: string;
  summary: string;
  content: string;
  flashcards: [string, string][];
  questions: [QuestionSeed, QuestionSeed, QuestionSeed];
}

interface TopicContentSeed {
  description: string;
  lessons: [LessonSeed, LessonSeed, LessonSeed];
}

export const seedContent: Record<string, TopicContentSeed> = {
  'basics-of-physics': {
    description: 'Build an intuition for motion, forces, and the conservation of energy.',
    lessons: [
      {
        title: 'Describing motion',
        summary: 'Use position, velocity, and acceleration to describe how objects move.',
        content: `# Describing motion

Physics begins by describing changes in position. **Displacement** is the change from a starting position to an ending position; unlike distance, it includes direction. **Velocity** is displacement per unit time, while **speed** is the magnitude of velocity.

**Acceleration** measures how quickly velocity changes. An object accelerates when it speeds up, slows down, or changes direction. For constant acceleration, the relationship between velocity, acceleration, and elapsed time is simple: final velocity equals initial velocity plus acceleration multiplied by time.

These are models: they work especially well when motion is measured at everyday speeds and across short distances. Always state a reference frame, since motion is described relative to an observer.`,
        flashcards: [
          ['Velocity', 'Displacement per unit time, including direction.'],
          ['Acceleration', 'The rate at which velocity changes over time.'],
        ],
        questions: [
          ['A runner completes one lap and finishes where they started. What is their displacement?', ['Zero', 'Equal to the track length', 'Equal to their average speed', 'Impossible to determine'], 0, 'Displacement depends on the change in position. The runner ends at the starting point.'],
          ['Which quantity includes direction?', ['Velocity', 'Distance', 'Speed', 'Elapsed time'], 0, 'Velocity is a vector; speed is its direction-free magnitude.'],
          ['A car slows while moving east. Which way does its acceleration point?', ['West', 'East', 'North', 'It has no acceleration'], 0, 'Acceleration points opposite the motion when an object slows down.'],
        ],
      },
      {
        title: 'Forces and Newton’s laws',
        summary: 'Connect forces with changes in motion using Newton’s three laws.',
        content: `# Forces and Newton’s laws

A **force** is an interaction that can change an object's motion. Newton’s first law says that an object keeps its velocity unless a net external force acts on it. This tendency to resist a change in motion is called **inertia**.

Newton’s second law quantifies the effect: net force equals mass multiplied by acceleration. For the same mass, a larger net force produces a larger acceleration. For the same force, a larger mass accelerates less. Forces are vectors, so their directions matter when adding them.

Newton’s third law describes interactions: if object A pushes on object B, B pushes back on A with an equal and opposite force. The pair acts on different objects, so the forces do not cancel on either single object.`,
        flashcards: [
          ['Net force', 'The vector sum of all forces acting on an object.'],
          ['Inertia', 'An object’s resistance to changes in its velocity.'],
        ],
        questions: [
          ['If the net force on a cart is zero, what happens to its velocity?', ['It remains constant', 'It must become zero', 'It increases', 'It reverses'], 0, 'Newton’s first law says zero net force means no change in velocity.'],
          ['A fixed force is applied to twice the mass. How does acceleration change?', ['It is halved', 'It doubles', 'It stays the same', 'It becomes zero'], 0, 'From F = ma, doubling mass at the same force halves acceleration.'],
          ['A swimmer pushes water backward. What is the reaction force?', ['The water pushes the swimmer forward', 'The water pushes the swimmer backward', 'Gravity pushes the swimmer forward', 'There is no reaction force'], 0, 'The equal-and-opposite interaction acts on the water and swimmer respectively.'],
        ],
      },
      {
        title: 'Work, energy, and power',
        summary: 'Track energy transfers through work and distinguish energy from power.',
        content: `# Work, energy, and power

Energy is a useful accounting quantity. **Kinetic energy** is associated with motion and increases with the square of speed. **Gravitational potential energy** near Earth depends on an object's mass, height, and the strength of gravity.

In physics, **work** is energy transferred when a force acts through a displacement. A force perpendicular to the displacement does no work on the object. Work can change kinetic energy; energy can also move between forms, such as potential energy becoming kinetic energy as an object falls.

In a closed system, total energy is conserved, though some may spread into less useful forms such as thermal energy. **Power** is the rate of energy transfer: doing the same work in less time requires more power.`,
        flashcards: [
          ['Kinetic energy', 'Energy associated with motion; proportional to mass and speed squared.'],
          ['Power', 'The rate at which work is done or energy is transferred.'],
        ],
        questions: [
          ['If an object’s speed doubles, what happens to its kinetic energy?', ['It becomes four times as large', 'It doubles', 'It is halved', 'It stays the same'], 0, 'Kinetic energy is proportional to the square of speed.'],
          ['When does a force do zero work on an object?', ['When the force is perpendicular to displacement', 'Whenever the object is moving', 'Only when the force is large', 'When force and displacement point the same way'], 0, 'Work depends on the component of force along the displacement.'],
          ['Two people do the same work; one does it faster. Who produces more power?', ['The person who finishes faster', 'The person who finishes slower', 'They produce equal power', 'Power cannot be compared'], 0, 'Power is work divided by time.'],
        ],
      },
    ],
  },
  'introduction-to-genetics': {
    description: 'Learn how DNA stores information and how traits are inherited and varied.',
    lessons: [
      {
        title: 'DNA, genes, and chromosomes',
        summary: 'See how genetic information is organized from DNA into genes and chromosomes.',
        content: `# DNA, genes, and chromosomes

DNA is a molecule built from four nucleotide bases: A, C, G, and T. The order of these bases stores biological information. In the familiar double helix, A pairs with T and C pairs with G, allowing each strand to serve as a template when DNA is copied.

A **gene** is a DNA sequence that contributes to a functional product, often a protein or functional RNA. Genes are only part of the genome; many DNA regions regulate when and where genes are active. In humans and many other organisms, DNA is packaged with proteins into **chromosomes**.

Most human body cells have two copies of each autosome, one inherited from each parent. The genome is not a blueprint that determines every outcome: gene activity interacts with other genes and with the environment.`,
        flashcards: [
          ['Nucleotide base', 'One of the DNA letters A, C, G, or T.'],
          ['Gene', 'A DNA sequence that contributes to a functional product.'],
        ],
        questions: [
          ['Which DNA base pairs with cytosine (C)?', ['Guanine (G)', 'Adenine (A)', 'Thymine (T)', 'Uracil (U)'], 0, 'In DNA, cytosine pairs with guanine.'],
          ['What is the relationship between a gene and a chromosome?', ['A chromosome contains many DNA regions, including genes', 'A gene is a whole chromosome', 'Chromosomes are made only of genes', 'Genes are made of proteins and contain no DNA'], 0, 'Genes are sequences within the much larger DNA molecules packaged into chromosomes.'],
          ['Where does much genetic variation come from?', ['Differences in DNA sequence', 'Differences in cell size alone', 'The number of meals eaten', 'Identical DNA in every individual'], 0, 'Inherited and newly arising sequence differences contribute to genetic variation.'],
        ],
      },
      {
        title: 'From genes to proteins',
        summary: 'Follow gene expression from DNA transcription to protein translation.',
        content: `# From genes to proteins

For protein-coding genes, gene expression commonly involves two stages. During **transcription**, a cell uses one DNA strand as a template to make messenger RNA (mRNA). In RNA, uracil (U) is used instead of thymine (T). In eukaryotic cells, the RNA transcript is processed before it leaves the nucleus.

During **translation**, a ribosome reads the mRNA in three-base units called codons. Transfer RNAs help match codons with amino acids, which are joined into a protein. The sequence of amino acids influences how the protein folds and functions.

Cells can regulate gene expression at many points: whether a gene is transcribed, how long its RNA lasts, and how much protein is made. As a result, cells with the same genome can perform different jobs.`,
        flashcards: [
          ['Transcription', 'Making an RNA copy from a DNA template.'],
          ['Codon', 'A three-nucleotide mRNA sequence that specifies an amino acid or stop signal.'],
        ],
        questions: [
          ['What is produced directly by transcription of a protein-coding gene?', ['An RNA transcript', 'A finished protein', 'A chromosome', 'An amino acid chain'], 0, 'Transcription copies information from DNA into RNA; translation makes a protein.'],
          ['How many RNA bases form one codon?', ['Three', 'One', 'Two', 'Four'], 0, 'Each codon consists of three nucleotides.'],
          ['Why can two cell types behave differently despite sharing the same genome?', ['They express different sets or amounts of genes', 'They have no DNA in common', 'Their DNA bases change every hour', 'Only one cell type has proteins'], 0, 'Cell identity is strongly shaped by regulated patterns of gene expression.'],
        ],
      },
      {
        title: 'Inheritance and variation',
        summary: 'Understand alleles, inheritance patterns, and the limits of simple genetic predictions.',
        content: `# Inheritance and variation

Different versions of the same gene are called **alleles**. For many genes, an individual inherits one allele from each biological parent. A **genotype** describes genetic variants; a **phenotype** is an observable characteristic influenced by genotype and often by environment.

For a simple autosomal gene with two alleles, a Punnett square can list possible allele combinations in offspring. If one allele is dominant in that particular trait model, one copy may be enough to affect the phenotype. Dominance does not mean that an allele is more common, healthier, or evolutionarily superior.

Many traits—such as height—are influenced by many genes and environmental factors. Even for a single gene, real inheritance can involve incomplete dominance, multiple alleles, or interactions that make simple classroom ratios incomplete.`,
        flashcards: [
          ['Allele', 'One version of a gene.'],
          ['Phenotype', 'An observable trait produced through genetic and environmental influences.'],
        ],
        questions: [
          ['What does a genotype describe?', ['An individual’s genetic allele combination', 'Only an observable trait', 'The environment alone', 'A complete chromosome count'], 0, 'Genotype refers to the genetic variants an individual carries.'],
          ['In a simple dominant/recessive model, what does “dominant” mean?', ['One copy can affect the phenotype', 'The allele is always more common', 'The allele is always beneficial', 'The allele cannot be inherited'], 0, 'Dominance describes how alleles affect a phenotype, not their frequency or value.'],
          ['Why are predictions for height not captured by a single Punnett square?', ['Many genes and environmental factors contribute', 'Height is not a trait', 'Children inherit no DNA', 'Punnett squares only work for plants'], 0, 'Height is a complex trait with many genetic and environmental influences.'],
        ],
      },
    ],
  },
  'quantum-computing': {
    description: 'Explore qubits, quantum measurement, and the algorithms that exploit them.',
    lessons: [
      {
        title: 'Qubits and superposition',
        summary: 'Compare classical bits with quantum states and understand superposition carefully.',
        content: `# Qubits and superposition

A classical bit is either 0 or 1. A **qubit** is a quantum system whose state can be described as a combination of basis states, often written α|0⟩ + β|1⟩. The complex amplitudes α and β determine the probabilities of outcomes when the qubit is measured; their squared magnitudes sum to one.

Superposition does not mean that a qubit reveals both answers when read. Measurement in the computational basis produces one result, 0 or 1, with probabilities determined by the state. The state also depends on the measurement basis, an important difference from a classical hidden bit.

Quantum algorithms manipulate amplitudes with gates. Their advantage, when one exists, comes from arranging interference so useful outcomes become more likely—not simply from trying every answer at once.`,
        flashcards: [
          ['Qubit', 'A quantum information unit whose state can be a superposition of basis states.'],
          ['Measurement', 'An interaction that yields a classical outcome with probabilities set by the quantum state.'],
        ],
        questions: [
          ['What does measuring a qubit in the computational basis return?', ['A single outcome, 0 or 1', 'Both 0 and 1 at once', 'Always 0', 'A classical probability distribution instead of an outcome'], 0, 'A measurement produces one classical result; repeated measurements reveal the probabilities.'],
          ['What condition do normalized qubit amplitudes satisfy?', ['Their squared magnitudes sum to one', 'They must both be zero', 'They must be positive integers', 'Their sum must equal two'], 0, 'Normalization ensures the measurement probabilities sum to one.'],
          ['How can quantum algorithms make useful outcomes more likely?', ['By controlling interference between amplitudes', 'By reading every superposition term directly', 'By copying unknown qubits freely', 'By avoiding measurement entirely'], 0, 'Quantum gates can cause constructive and destructive interference among paths.'],
        ],
      },
      {
        title: 'Entanglement and quantum gates',
        summary: 'Learn how gates transform qubits and why entangled states cannot be factored apart.',
        content: `# Entanglement and quantum gates

Quantum gates are reversible operations on quantum states. A one-qubit gate changes the amplitudes of one qubit; a two-qubit gate can create correlations that classical independent bits cannot reproduce. Computation applies a sequence of such gates before measurement.

Two qubits are **entangled** when their joint state cannot be written as a product of separate states for each qubit. For example, a Bell state can give perfectly correlated results when both qubits are measured in the same basis, even though neither result is predetermined by a local classical description.

Entanglement does not allow faster-than-light messaging. A person measuring one qubit cannot choose the random result to send a message; the correlations become apparent only after measurement records are compared through ordinary communication.`,
        flashcards: [
          ['Quantum gate', 'A reversible operation that transforms a quantum state.'],
          ['Entanglement', 'A joint quantum state that cannot be described as independent states of its parts.'],
        ],
        questions: [
          ['What makes a two-qubit state entangled?', ['It cannot be factored into separate states for each qubit', 'Both qubits must always measure 1', 'It contains more than two gates', 'It can transmit a message instantly'], 0, 'Entanglement is a property of the joint state, not a communication channel.'],
          ['Why does entanglement not enable faster-than-light communication?', ['A local measurement result cannot be chosen to encode a message', 'Entangled qubits are never measured', 'The qubits stop being correlated', 'Classical communication is faster than light'], 0, 'The outcome is not controllable; comparing correlations still requires ordinary communication.'],
          ['What is a key property of ideal quantum gates?', ['They are reversible transformations', 'They erase all amplitudes', 'They directly reveal the state', 'They work only on classical bits'], 0, 'Quantum evolution is represented by reversible unitary operations.'],
        ],
      },
      {
        title: 'Algorithms, noise, and error correction',
        summary: 'Place quantum speedups in context and learn why error correction is essential.',
        content: `# Algorithms, noise, and error correction

Quantum computers are not faster for every task. Shor’s algorithm can factor integers efficiently on a sufficiently large, fault-tolerant quantum computer, while Grover’s algorithm offers a quadratic speedup for unstructured search. Each advantage depends on assumptions about the problem and available hardware.

Real devices are affected by **decoherence**, imperfect gates, and measurement errors. These errors accumulate as a computation grows. A physical qubit is therefore unreliable for long calculations without protection.

Quantum error correction encodes one logical qubit across multiple physical qubits. Carefully chosen measurements detect error syndromes without directly measuring and destroying the encoded information. Fault-tolerant computation requires error rates below thresholds and substantial hardware overhead.`,
        flashcards: [
          ['Decoherence', 'Loss of useful quantum behavior through unwanted interaction with the environment.'],
          ['Logical qubit', 'An error-protected qubit encoded across multiple physical qubits.'],
        ],
        questions: [
          ['What type of speedup does Grover’s algorithm provide for unstructured search?', ['Quadratic', 'Exponential for every task', 'No speedup', 'A speedup only for sorting'], 0, 'Grover’s algorithm reduces query complexity quadratically.'],
          ['What is decoherence?', ['Disruption of quantum state information through environmental interaction', 'A method for copying a qubit', 'A type of classical sorting', 'A guaranteed speedup'], 0, 'Environmental coupling can destroy the coherent properties computation relies on.'],
          ['How does quantum error correction protect information?', ['It encodes logical information across multiple physical qubits and detects errors', 'It reads every qubit after each gate', 'It prevents all environmental interaction', 'It replaces qubits with ordinary bits'], 0, 'Redundant encoding and syndrome measurements identify errors without directly reading the logical state.'],
        ],
      },
    ],
  },
  'how-the-internet-works': {
    description: 'Follow data through networks, from DNS lookup to encrypted web requests.',
    lessons: [
      {
        title: 'Packets and IP routing',
        summary: 'Understand packet switching, IP addresses, and how routers forward traffic.',
        content: `# Packets and IP routing

The internet is a network of interconnected networks. When an application sends data, protocols divide it into **packets** with addressing and control information. Packets may travel along different routes and are reassembled by the receiving application or transport protocol.

IP addresses identify network interfaces for routing. Routers examine destination addresses and forward packets using routing tables. IP offers best-effort delivery: packets can be delayed, lost, or arrive out of order.

Reliability is added at other layers when needed. TCP detects loss and retransmits data to provide an ordered byte stream; UDP sends datagrams with less built-in coordination. Applications choose protocols according to their latency and reliability needs.`,
        flashcards: [
          ['Packet', 'A unit of network data carrying payload and delivery metadata.'],
          ['Router', 'A device that forwards packets between networks using routing information.'],
        ],
        questions: [
          ['What does IP primarily provide?', ['Addressing and best-effort packet delivery', 'Guaranteed ordered delivery', 'Web page rendering', 'Encryption of every application'], 0, 'IP routes packets but does not guarantee delivery or order.'],
          ['What is one reason data is split into packets?', ['Networks can route and share smaller units of data', 'Packets guarantee a fixed route', 'Packets remove the need for addresses', 'Each packet is a complete copy of the internet'], 0, 'Packet switching lets network links be shared among many communications.'],
          ['Which protocol commonly adds reliable, ordered delivery?', ['TCP', 'DNS', 'IP alone', 'HTML'], 0, 'TCP provides a reliable ordered byte stream over IP.'],
        ],
      },
      {
        title: 'DNS and web protocols',
        summary: 'Trace how a browser finds a server and exchanges an HTTP request.',
        content: `# DNS and web protocols

People use domain names such as example.org; networks route using IP addresses. The **Domain Name System (DNS)** lets a resolver look up records associated with a name. Results may be cached, so a browser often avoids repeating the full lookup.

Once connected to a server, a browser sends an **HTTP** request describing a method, path, headers, and possibly a body. The server replies with a status code, headers, and content. HTTP is an application-layer protocol; HTML, CSS, and JavaScript are common content the browser may then interpret.

Modern web traffic usually uses HTTP over TLS (HTTPS). DNS lookup, connection establishment, encryption, and the HTTP exchange are distinct steps, even when browser tools present them together.`,
        flashcards: [
          ['DNS', 'A distributed naming system that resolves domain names to records such as IP addresses.'],
          ['HTTP', 'An application protocol for requests and responses between clients and servers.'],
        ],
        questions: [
          ['What problem does DNS solve?', ['Mapping names to records such as IP addresses', 'Encrypting all network traffic', 'Rendering HTML', 'Guaranteeing a server is trustworthy'], 0, 'DNS provides name resolution; it is not itself an encryption or trust guarantee.'],
          ['In a typical HTTP exchange, what does the server send back?', ['A response with a status, headers, and optional content', 'A DNS domain name only', 'A router table', 'The browser’s source code'], 0, 'HTTP follows a request-response model.'],
          ['What does HTTPS add to HTTP in common web deployments?', ['TLS protection for the connection', 'Automatic correctness of all content', 'Guaranteed absence of malware', 'A replacement for DNS'], 0, 'HTTPS is HTTP carried over TLS, protecting the connection and authenticating the server certificate.'],
        ],
      },
      {
        title: 'TLS and secure connections',
        summary: 'Learn what TLS protects and why certificates and verification matter.',
        content: `# TLS and secure connections

Transport Layer Security (TLS) protects a connection against eavesdropping and tampering. During a handshake, the client and server agree on cryptographic parameters and establish shared session keys. Modern TLS uses public-key techniques in the handshake and efficient symmetric encryption for the data.

For HTTPS, the server presents a certificate that binds a domain name to a public key. The browser checks that the certificate chains to a trusted authority, is valid for the requested name, and has not expired. This helps authenticate the server, not guarantee that the site’s content is safe or honest.

TLS protects data in transit between the endpoints. It does not protect a compromised device, prevent a user from sending information to the wrong site, or secure data after it reaches the server.`,
        flashcards: [
          ['TLS', 'A protocol that protects data in transit and can authenticate a server.'],
          ['Certificate', 'A digitally signed binding between an identity, such as a domain, and a public key.'],
        ],
        questions: [
          ['What is a central goal of TLS?', ['Protect data in transit against eavesdropping and tampering', 'Guarantee the website is honest', 'Prevent every device compromise', 'Replace application passwords'], 0, 'TLS secures the connection, not the trustworthiness of all content or endpoints.'],
          ['What does a browser check in an HTTPS certificate?', ['Whether it is trusted and valid for the requested domain', 'Whether the web page is factually accurate', 'Whether the user has an account', 'Whether every link is safe'], 0, 'Certificate validation helps authenticate the server identity for the domain.'],
          ['Which type of encryption is generally efficient for bulk TLS data?', ['Symmetric encryption with session keys', 'A public-key operation for every byte', 'No encryption', 'A DNS record'], 0, 'TLS uses negotiated symmetric keys for efficient protection of application data.'],
        ],
      },
    ],
  },
  'machine-learning-fundamentals': {
    description: 'Build a practical foundation in training data, model evaluation, and generalization.',
    lessons: [
      {
        title: 'Supervised learning',
        summary: 'Learn how labeled examples train models for prediction and classification.',
        content: `# Supervised learning

In **supervised learning**, a model learns from examples that pair inputs with known targets. For example, an email classifier receives message features as input and a label such as “spam” as its target. A regression model predicts a numeric target; a classifier predicts a category or class probabilities.

Training adjusts model parameters to reduce a **loss function**, which measures disagreement between predictions and targets. The algorithm that adjusts those parameters is an optimizer. A low training loss is not enough: the goal is to perform well on new examples drawn from the intended use case.

Data quality and labels matter. If labels are inconsistent, biased, or unrelated to the real goal, a sophisticated model can still learn the wrong behavior.`,
        flashcards: [
          ['Feature', 'An input variable used by a model to make a prediction.'],
          ['Label', 'The target value a supervised model learns to predict.'],
        ],
        questions: [
          ['What distinguishes supervised learning?', ['Training examples include target labels', 'It never uses data', 'It can only generate images', 'It has no objective'], 0, 'Supervised learning uses input-target pairs to learn a predictive relationship.'],
          ['Which task is typically regression?', ['Predicting next week’s temperature as a number', 'Assigning an email to spam or not spam', 'Grouping customers without labels', 'Sorting files alphabetically'], 0, 'Regression predicts a numeric value.'],
          ['Why is low training loss not enough to judge a model?', ['It may perform poorly on new examples', 'It proves the labels are perfect', 'It guarantees no bias', 'It means the model has no parameters'], 0, 'Evaluation must test generalization beyond the examples used to fit the model.'],
        ],
      },
      {
        title: 'Overfitting and generalization',
        summary: 'Recognize overfitting and use data splits and regularization responsibly.',
        content: `# Overfitting and generalization

A model **generalizes** when it makes useful predictions on data it did not train on. **Overfitting** occurs when a model fits accidental details or noise in its training examples and consequently performs worse on new data.

A common workflow separates data into training, validation, and test sets. Training data fits parameters; validation data helps compare models and tune choices; the test set is reserved for a final, relatively unbiased estimate. Repeatedly adjusting a model based on test results leaks information from the test set.

Regularization discourages overly complex fits. More data, simpler models, and early stopping can also help. These are tools, not guarantees: splits should reflect how the model will be used, including time, people, or locations that may differ.`,
        flashcards: [
          ['Overfitting', 'Fitting training-specific noise in a way that harms performance on new data.'],
          ['Validation set', 'Data used to compare models or tune choices without fitting their parameters.'],
        ],
        questions: [
          ['A model scores very well on training data but poorly on fresh data. What is the likely issue?', ['Overfitting', 'Underfitting caused by no training', 'Perfect generalization', 'A larger test set'], 0, 'The gap between training and new-data performance is a classic overfitting signal.'],
          ['Why should the test set be used sparingly?', ['Repeated tuning against it makes it no longer an independent final check', 'It cannot contain labels', 'It is only for training parameters', 'It automatically improves the model'], 0, 'Using test feedback during development leaks information into model selection.'],
          ['What is one purpose of regularization?', ['Discourage overly complex fits', 'Add incorrect labels', 'Replace validation data', 'Guarantee fairness'], 0, 'Regularization constrains the fit and can improve generalization, though it is not a guarantee.'],
        ],
      },
      {
        title: 'Evaluation and responsible use',
        summary: 'Choose metrics that match the goal and examine data quality and model limitations.',
        content: `# Evaluation and responsible use

Accuracy is the share of predictions that are correct, but it can mislead when classes are imbalanced. **Precision** asks what fraction of predicted positives are truly positive; **recall** asks what fraction of actual positives were found. A false positive and a false negative may have very different costs.

Evaluation should use representative data and a metric tied to the real decision. Check performance across relevant groups and contexts, and examine calibration when predicted probabilities guide action. A strong average score can hide failures on a subgroup or under a changed data distribution.

Models inherit limitations from their data and design. Document intended use, monitor changes, protect sensitive information, and keep people accountable for consequential decisions. A metric is evidence about a defined test—not a complete measure of social value or safety.`,
        flashcards: [
          ['Precision', 'Among predicted positives, the proportion that are truly positive.'],
          ['Recall', 'Among actual positives, the proportion correctly identified.'],
        ],
        questions: [
          ['A screening system should miss as few true cases as possible. Which metric is especially relevant?', ['Recall', 'Precision alone', 'Training loss only', 'Number of model parameters'], 0, 'Recall measures the fraction of actual positive cases that are found.'],
          ['Why can accuracy be misleading on highly imbalanced data?', ['A model can score well by predicting the majority class', 'Accuracy never uses labels', 'It always equals recall', 'Imbalanced data cannot be evaluated'], 0, 'The majority class can dominate accuracy while minority cases are missed.'],
          ['What does a high benchmark score establish?', ['Performance on that benchmark under its evaluation conditions', 'That the model is safe for every use', 'That the data has no bias', 'That future data will never change'], 0, 'A benchmark is limited evidence, not a guarantee of universal suitability.'],
        ],
      },
    ],
  },
  'distributed-systems': {
    description: 'Study replication, consistency, and coordination across independent computers.',
    lessons: [
      {
        title: 'Failure and replication',
        summary: 'Understand why distributed systems replicate data and must expect partial failure.',
        content: `# Failure and replication

A distributed system coordinates computers that communicate over a network. Unlike a single process, it must handle **partial failure**: one machine or network link can fail while others continue. A timeout does not reveal whether a request was lost, delayed, or completed with its reply lost.

Replication stores copies of data on multiple machines to improve availability or read performance. Replicas introduce a coordination problem: after an update, copies may temporarily disagree. The system needs rules for propagating changes and deciding which reads are allowed.

Retries also need care. If a client retries a timed-out payment request, the original may already have succeeded. Idempotency keys or deduplication can make repeated requests safe. Reliability comes from explicit failure handling, not from assuming networks behave perfectly.`,
        flashcards: [
          ['Partial failure', 'A condition where some components fail while others remain operational.'],
          ['Idempotent operation', 'An operation that can be repeated without changing the result after its first success.'],
        ],
        questions: [
          ['What can a client conclude from a network timeout?', ['The outcome may be unknown; the request might have completed', 'The server definitely never received the request', 'The server definitely crashed', 'The data was not changed'], 0, 'A lost response makes the request outcome ambiguous.'],
          ['Why use replication?', ['To improve availability or read capacity with multiple copies', 'To eliminate all coordination', 'To make networks unnecessary', 'To guarantee every copy updates instantly'], 0, 'Replication provides useful redundancy but creates consistency and coordination challenges.'],
          ['How can an idempotency key help with retries?', ['It lets the server recognize duplicate submissions', 'It encrypts the request', 'It guarantees low latency', 'It prevents every network failure'], 0, 'A stable key can identify repeated attempts at the same logical operation.'],
        ],
      },
      {
        title: 'Consistency and consensus',
        summary: 'Compare consistency guarantees and learn what consensus protocols coordinate.',
        content: `# Consistency and consensus

**Consistency** describes what values clients may observe when data is read and written. Stronger guarantees, such as linearizability, make operations appear to occur atomically in a single real-time order. Weaker guarantees may allow temporary stale reads in exchange for availability or lower latency.

**Consensus** is a problem in which distributed participants agree on a value despite delays and certain failures. Protocols such as Raft use a leader and replicated log to order commands. Consensus is useful for coordination, but it does not make arbitrary application logic correct or networks instantaneous.

For a given operation, choose a guarantee that matches its consequences. A stale social feed may be acceptable; a duplicate bank transfer is not. Stronger coordination can increase latency and reduce availability during some failures, so trade-offs should be explicit.`,
        flashcards: [
          ['Linearizability', 'A consistency guarantee where operations appear atomic and respect real-time order.'],
          ['Consensus', 'Agreement among distributed participants on a value or ordered decision despite failures.'],
        ],
        questions: [
          ['What does linearizability require?', ['Operations appear atomic in an order consistent with real time', 'Every read is permanently cached', 'All networks have zero latency', 'Replicas never fail'], 0, 'Linearizability gives operations a single order that respects real-time precedence.'],
          ['What is consensus used for?', ['Coordinating agreement on decisions among distributed participants', 'Encrypting files on disk', 'Compressing network packets', 'Eliminating all application bugs'], 0, 'Consensus protocols help participants agree despite delays and certain failures.'],
          ['Which feature may be acceptable with temporarily stale data?', ['A social feed', 'A transfer that must not be duplicated', 'A one-time password verifier', 'A unique account identifier'], 0, 'Some feed updates can tolerate eventual convergence, unlike operations with strict financial consequences.'],
        ],
      },
      {
        title: 'Partitions and practical trade-offs',
        summary: 'Reason about network partitions, availability, and safe system design.',
        content: `# Partitions and practical trade-offs

A network **partition** prevents some nodes from communicating with others. During a partition, a replicated service must decide whether to reject some requests or risk serving divergent results. This is a practical trade-off: no design can guarantee every strong consistency behavior and uninterrupted availability under all partition conditions.

Availability should be defined from a client’s perspective: can a request receive a successful response within an acceptable time? Returning stale data may count as available for a read-heavy app but fail the needs of a balance update. Partition tolerance is not optional in a network; partitions are among the failures systems must handle.

Design for recovery: use timeouts, bounded retries with backoff, idempotent writes, and observability. Test failure scenarios and document which guarantees each operation provides. A clear degraded mode is safer than silently claiming every request succeeded.`,
        flashcards: [
          ['Network partition', 'A communication break that separates parts of a distributed system.'],
          ['Backoff', 'A retry strategy that waits progressively longer to reduce load during failures.'],
        ],
        questions: [
          ['During a partition, why might a service reject writes?', ['To avoid accepting conflicting updates that cannot be coordinated', 'Because all servers are necessarily powered off', 'To make latency zero', 'Because reads are impossible'], 0, 'A service may sacrifice some availability to preserve consistency.'],
          ['What does availability usually mean from a client’s viewpoint?', ['A timely response that meets the operation’s success criteria', 'A server process exists somewhere', 'Every replica is perfectly current', 'A request never takes time'], 0, 'Availability concerns whether the client receives an acceptable response.'],
          ['What is a benefit of bounded retries with backoff?', ['They limit repeated load while allowing transient failures to recover', 'They guarantee the first request succeeded', 'They remove the need for timeouts', 'They force replicas to agree instantly'], 0, 'Backoff and retry limits reduce retry storms and contain failure impact.'],
        ],
      },
    ],
  },
  'personal-budgeting': {
    description: 'Build a flexible spending plan, manage cash flow, and prepare for unexpected costs.',
    lessons: [
      {
        title: 'Map income and expenses',
        summary: 'Create a realistic picture of take-home income, fixed costs, and variable spending.',
        content: `# Map income and expenses

A budget is a plan for allocating money over time, not a judgment about spending. Start with **take-home income**—what arrives after taxes and payroll deductions—then list essential fixed costs such as rent and insurance, variable essentials such as groceries, and discretionary spending.

Use several months of transactions where possible. Irregular costs, including annual subscriptions, repairs, and gifts, are easy to miss if you look only at a typical month. Divide predictable annual expenses into monthly amounts so they do not arrive as surprises.

Compare planned spending with income and actual transactions. If expenses exceed income, identify changes that are feasible and prioritize essentials. A budget works best when it reflects real constraints and is reviewed regularly rather than treated as a perfect forecast.`,
        flashcards: [
          ['Take-home income', 'Income available after taxes and payroll deductions.'],
          ['Irregular expense', 'A less frequent cost that should still be anticipated in a spending plan.'],
        ],
        questions: [
          ['Which income figure is usually most useful for a household spending plan?', ['Take-home income', 'Gross income before any deductions', 'A credit limit', 'The value of investments'], 0, 'Take-home income is the amount actually available for spending and saving.'],
          ['Why review several months of transactions?', ['To identify variable and irregular expenses', 'To guarantee future prices never change', 'To avoid tracking income', 'To eliminate all discretionary spending'], 0, 'A longer view helps reveal patterns that one month can hide.'],
          ['How can an annual insurance premium be represented in a monthly budget?', ['Set aside roughly one-twelfth each month', 'Ignore it until due', 'Count it as income', 'Multiply it by twelve'], 0, 'Saving a monthly portion helps prepare for a predictable irregular bill.'],
        ],
      },
      {
        title: 'Set goals and allocate money',
        summary: 'Turn priorities into practical spending limits and savings targets.',
        content: `# Set goals and allocate money

After mapping cash flow, assign money to priorities: essentials, debt obligations, savings, and discretionary goals. A common starting framework is 50/30/20—needs, wants, and savings or debt repayment—but it is a guideline, not a rule. Housing costs, location, income, and family responsibilities can make those percentages unrealistic.

Make goals specific and time-bound. For example, estimate the amount needed for a planned expense and divide it by the months available. Automating a transfer can help, provided the timing does not cause overdrafts or leave too little for bills.

When money is tight, prioritize necessities and minimum required debt payments, then consider which flexible costs can change. Avoid comparing your plan to someone else’s circumstances; the useful budget is one that is sustainable for you.`,
        flashcards: [
          ['Zero-based budget', 'A plan that assigns every unit of expected income to a purpose, including savings.'],
          ['Savings target', 'A defined amount and time horizon for a financial goal.'],
        ],
        questions: [
          ['How should the 50/30/20 guideline be treated?', ['As a flexible starting point, not a universal rule', 'As a legal requirement', 'As a guarantee of wealth', 'As a substitute for tracking expenses'], 0, 'Personal circumstances can make different allocations more realistic.'],
          ['A goal costs $600 and is 6 months away. Ignoring interest, what monthly saving reaches it?', ['$100', '$60', '$300', '$3,600'], 0, '$600 divided evenly across six months is $100 per month.'],
          ['What does a zero-based budget do?', ['Assigns expected income to planned uses until none is unassigned', 'Requires spending all income', 'Excludes savings', 'Means having a zero bank balance'], 0, 'Zero-based budgeting gives every dollar a planned job; it does not mean spending it all.'],
        ],
      },
      {
        title: 'Emergency savings and review',
        summary: 'Prepare for shocks, choose a savings pace, and adapt a budget as life changes.',
        content: `# Emergency savings and review

An emergency fund is money set aside for urgent, unexpected costs or interruptions in income. The right target depends on job stability, dependents, insurance, and access to other resources. Many guides suggest building toward several months of essential expenses, but starting with a smaller achievable buffer is valuable too.

Keep emergency money accessible and relatively low risk; it is not meant to maximize investment returns. Separate it from everyday spending if that helps avoid accidental use. Replenish it after an emergency before resuming lower-priority goals when possible.

Review the budget monthly at first, then at a cadence that works. Compare actual and planned spending, update assumptions after a change in income or housing, and adjust without treating a single unexpected month as failure.`,
        flashcards: [
          ['Emergency fund', 'Accessible savings reserved for unexpected costs or income disruptions.'],
          ['Essential expenses', 'Costs needed to maintain basic living and required obligations.'],
        ],
        questions: [
          ['What is an emergency fund primarily for?', ['Unexpected urgent costs or an income disruption', 'Routine entertainment spending', 'Maximizing short-term investment returns', 'Replacing all insurance'], 0, 'Emergency savings provide a liquid buffer for unexpected needs.'],
          ['Which is generally a sensible place for emergency savings?', ['An accessible, relatively low-risk account', 'A volatile asset needed for next month’s rent', 'A locked account with large withdrawal penalties', 'A speculative investment'], 0, 'Liquidity and preservation matter more than high returns for near-term emergencies.'],
          ['How should a budget respond to a lasting change in income?', ['Update the plan and priorities to reflect the new reality', 'Keep the old numbers unchanged', 'Stop reviewing transactions', 'Assume expenses will automatically fall'], 0, 'A budget is a living plan and should be revised when circumstances change.'],
        ],
      },
    ],
  },
  'investing-in-index-funds': {
    description: 'Understand index funds, diversification, fees, and the risks of investing.',
    lessons: [
      {
        title: 'What an index fund owns',
        summary: 'Learn how index funds track a market benchmark and what diversification means.',
        content: `# What an index fund owns

An **index** is a rules-based measure of a market or segment, such as a broad stock-market benchmark. An index fund aims to track that benchmark by holding its securities or using a sampling method. The fund is not the index itself; it is an investment product designed to follow it.

Owning a broad index fund can spread exposure across many companies, reducing the impact of a problem at one company. It does not remove market risk: if the market falls, the fund can lose value. A narrow sector fund may contain many holdings yet still be concentrated in one industry.

Before investing, check what the benchmark includes, how the fund tracks it, and whether its holdings match your intended allocation. Diversification depends on underlying exposures, not just the number of tickers.`,
        flashcards: [
          ['Index fund', 'A fund that seeks to track the returns of a specified market index.'],
          ['Diversification', 'Spreading exposure across investments to reduce dependence on any one holding.'],
        ],
        questions: [
          ['What does an index fund generally aim to do?', ['Track the performance of a specified index', 'Guarantee a positive return', 'Avoid every market decline', 'Select only the fastest-growing company'], 0, 'Index funds follow a benchmark rather than promising a particular outcome.'],
          ['Does owning a broad stock index fund eliminate market risk?', ['No; the fund can still fall when the market falls', 'Yes, diversification prevents losses', 'Yes, if it has more than ten holdings', 'Only during recessions'], 0, 'Diversification can reduce company-specific risk but not broad market risk.'],
          ['Why can a sector fund remain concentrated despite many holdings?', ['Its holdings may all depend on the same industry', 'It holds only cash', 'It cannot track an index', 'It always owns one company'], 0, 'Many securities can share the same underlying sector risk.'],
        ],
      },
      {
        title: 'Costs and tracking',
        summary: 'Compare expense ratios, trading costs, and the gap between a fund and its index.',
        content: `# Costs and tracking

Fund costs reduce the return investors keep. The **expense ratio** is an annual operating-cost measure expressed as a percentage of assets. A fund may also have trading costs, bid-ask spreads, or taxes that are not fully represented by that ratio.

**Tracking difference** is the gap between a fund’s return and its benchmark over a period. Fees contribute to that gap, but sampling, cash holdings, trading, and benchmark methodology also matter. Tracking error describes variability in the difference over time.

Comparisons should use the same period and benchmark, and account for share class, taxes, and available account fees. A low fee is useful, but it should not be the only criterion: the fund must track a suitable index and fit the investor’s overall plan.`,
        flashcards: [
          ['Expense ratio', 'A fund’s stated annual operating expenses as a percentage of assets.'],
          ['Tracking difference', 'The realized return gap between a fund and its benchmark over a period.'],
        ],
        questions: [
          ['How does an expense ratio affect an investor?', ['It reduces the return retained by the investor', 'It guarantees the benchmark return', 'It is paid only when a fund loses money', 'It determines future market performance'], 0, 'Operating expenses are a drag on the fund’s net returns.'],
          ['What is tracking difference?', ['The return gap between a fund and its benchmark over a period', 'The difference between two investors’ tax rates', 'The number of securities in a fund', 'A guarantee of outperformance'], 0, 'Tracking difference compares actual fund returns to the chosen index.'],
          ['Why might a fund’s tracking difference be larger than its expense ratio?', ['Trading, sampling, cash, and other effects also matter', 'The index always pays a dividend', 'The expense ratio includes every possible cost', 'Funds cannot hold cash'], 0, 'Several operational factors influence the return gap beyond the stated fee.'],
        ],
      },
      {
        title: 'Risk, time horizon, and behavior',
        summary: 'Relate investment risk to time horizon, allocation, and disciplined decision-making.',
        content: `# Risk, time horizon, and behavior

Investments can lose value, sometimes sharply. A **time horizon** is when money is expected to be needed; money required soon generally has less capacity to recover from a downturn. An asset allocation balances investments according to goals, horizon, and ability and willingness to accept losses.

Past performance does not reliably predict future returns. A diversified index fund can still experience long declines, and returns are never guaranteed. Investing borrowed money or money needed for near-term essentials can magnify harm.

A written plan can help investors avoid reacting to every market headline. Rebalancing restores a chosen allocation, but may have tax consequences in taxable accounts. Consider fees, local tax rules, and personal circumstances; this lesson is educational, not individualized financial advice.`,
        flashcards: [
          ['Time horizon', 'The expected period before invested money will be needed.'],
          ['Asset allocation', 'The mix of asset classes chosen for a portfolio.'],
        ],
        questions: [
          ['Why is a short time horizon important when choosing investments?', ['There may be little time to recover from a market decline', 'Short horizons guarantee higher returns', 'Markets cannot decline over a year', 'It removes the need to diversify'], 0, 'Money needed soon has less time to recover from volatility.'],
          ['What does rebalancing do?', ['Restores a portfolio toward its target allocation', 'Guarantees a profit', 'Removes taxes', 'Changes market risk to zero'], 0, 'Rebalancing adjusts holdings toward the chosen mix; it does not ensure returns.'],
          ['Which statement about past performance is sound?', ['It does not reliably predict future returns', 'It guarantees the same result next year', 'It is the only factor in choosing a fund', 'It eliminates investment risk'], 0, 'Historical returns are not a guarantee of future performance.'],
        ],
      },
    ],
  },
  'corporate-valuation': {
    description: 'Explore discounted cash flow, comparable-company analysis, and valuation assumptions.',
    lessons: [
      {
        title: 'Cash flows and the time value of money',
        summary: 'Learn why future cash flows are discounted and how assumptions shape value.',
        content: `# Cash flows and the time value of money

Corporate valuation estimates what a business may be worth under stated assumptions; it is not a directly observable fact. In a **discounted cash flow (DCF)** model, future free cash flows are estimated and converted to present value using a discount rate.

The discount rate reflects the time value of money and risk. A cash flow expected later is worth less today, and a higher discount rate lowers present value. Small changes in long-run growth or discount-rate assumptions can have a large effect, especially when much of the value comes from distant future cash flows.

Forecasts should be tied to business drivers such as revenue growth, margins, investment, and working capital. Precise-looking outputs do not make uncertain assumptions precise. Use ranges and sensitivity analysis to understand which assumptions matter most.`,
        flashcards: [
          ['Discount rate', 'The rate used to convert future cash flows into present value.'],
          ['Free cash flow', 'Cash generated after operating needs and investment, available to capital providers.'],
        ],
        questions: [
          ['What happens to a future cash flow’s present value when the discount rate rises?', ['It falls', 'It rises', 'It stays fixed', 'It becomes a revenue multiple'], 0, 'A higher discount rate reduces the present value of a given future cash flow.'],
          ['Why use sensitivity analysis in a DCF?', ['To see how value changes when assumptions change', 'To prove the forecast is certain', 'To remove all risk', 'To avoid estimating cash flows'], 0, 'Sensitivity analysis makes the model’s dependence on assumptions visible.'],
          ['Which can materially affect projected free cash flow?', ['Margins and required investment', 'The company logo color', 'The analyst’s preferred font', 'The number of spreadsheet tabs'], 0, 'Operating profitability and investment needs drive cash available to capital providers.'],
        ],
      },
      {
        title: 'Comparable-company analysis',
        summary: 'Use valuation multiples thoughtfully and compare businesses with care.',
        content: `# Comparable-company analysis

Comparable-company analysis estimates value by examining how markets price similar businesses. Common multiples include enterprise value to EBITDA and price to earnings. A multiple relates a market value to a financial measure; it is meaningful only when numerator, denominator, and accounting definitions are consistent.

Useful peers share relevant characteristics such as industry, growth, margins, risk, and capital intensity. No two companies are perfectly alike. Differences may explain why one deserves a higher or lower multiple, and a peer group should not be selected simply to support a preferred conclusion.

Multiples are shorthand, not complete models. They can embed different growth and risk expectations, and accounting choices can distort comparisons. Pair a peer range with business analysis and explain why the selected benchmark is appropriate.`,
        flashcards: [
          ['Enterprise value', 'A measure of the value of operating assets to all capital providers, commonly equity plus debt minus cash.'],
          ['Valuation multiple', 'A ratio comparing a market value with a financial measure such as earnings or EBITDA.'],
        ],
        questions: [
          ['Why compare firms with similar growth and risk?', ['Those differences influence the multiples investors may accept', 'It makes every company identical', 'It guarantees the same stock price', 'It removes the need to check accounting'], 0, 'Growth and risk are important drivers of valuation differences.'],
          ['What does EV/EBITDA compare?', ['Enterprise value with earnings before interest, taxes, depreciation, and amortization', 'Share price with annual dividends only', 'Debt with employee count', 'Revenue with cash balance'], 0, 'The multiple relates enterprise value to EBITDA.'],
          ['Why can peer multiples be misleading?', ['Companies may differ in accounting, growth, risk, and capital intensity', 'Multiples never use financial data', 'All firms have identical business models', 'Multiples directly reveal intrinsic value'], 0, 'Multiples compress assumptions and may hide important differences.'],
        ],
      },
      {
        title: 'From enterprise value to equity value',
        summary: 'Connect operating value to shareholders and communicate valuation uncertainty.',
        content: `# From enterprise value to equity value

Enterprise value represents the value of operating assets available to debt and equity capital providers. A simplified bridge from enterprise value to equity value subtracts debt and other senior claims, then adds excess cash and non-operating assets. The exact bridge depends on the company and the valuation convention.

Divide equity value by diluted shares to estimate value per share. Dilution may include options or convertible securities; the method used to count them can matter. Check that the cash-flow measure and discount rate match the value being calculated—for example, enterprise cash flows are discounted at a rate appropriate to all capital providers.

A valuation should communicate a range, key assumptions, and limitations. Market price and estimated value can differ for many reasons, and neither a model nor a multiple is investment advice by itself.`,
        flashcards: [
          ['Equity value', 'The value attributable to shareholders after accounting for debt and other senior claims.'],
          ['Diluted shares', 'A share count that reflects potential shares from instruments such as options or convertibles.'],
        ],
        questions: [
          ['In a simplified bridge, how do you move from enterprise value toward equity value?', ['Subtract debt and add excess cash', 'Add all debt and subtract all revenue', 'Divide by EBITDA', 'Subtract operating expenses twice'], 0, 'Debt claims reduce equity value, while excess cash is generally added.'],
          ['What is the purpose of diluted shares in per-share valuation?', ['Reflect potential shares that may reduce each share’s claim', 'Count only shares owned by founders', 'Measure annual revenue', 'Remove debt from enterprise value'], 0, 'Potential dilution can increase the share count used for per-share estimates.'],
          ['What should a responsible valuation communicate?', ['Assumptions, uncertainty, and a range where appropriate', 'A guaranteed future stock price', 'Only one precise number without context', 'That market prices are always wrong'], 0, 'Valuation is assumption-dependent; transparent uncertainty is essential.'],
        ],
      },
    ],
  },
  'ancient-rome': {
    description: 'Trace Rome from republic to empire and examine its institutions and daily life.',
    lessons: [
      {
        title: 'The Roman Republic',
        summary: 'Explore republican offices, civic conflict, and Rome’s expansion in Italy.',
        content: `# The Roman Republic

Roman tradition dates the Republic to 509 BCE, after the overthrow of its kings. Political power was distributed among elected magistrates, the Senate, and popular assemblies, but participation and influence were unequal. The system changed over centuries rather than following one fixed constitution.

Conflict between patricians and plebeians led to political concessions, including the tribunate. Rome also expanded through alliances and wars across Italy. Its institutions were designed for a city-state but increasingly governed a large and diverse territory.

Expansion brought wealth, enslaved labor, and new pressures. Competition among elite leaders, unequal landholding, and the challenges of governing distant provinces contributed to instability. The Republic’s end was a process marked by civil wars, not a single moment.`,
        flashcards: [
          ['Tribune', 'An elected Roman official who represented plebeian interests and could veto certain actions.'],
          ['Roman Senate', 'An influential political body, especially important in advising magistrates and directing policy.'],
        ],
        questions: [
          ['Which institution represented plebeian interests in the Republic?', ['The tribunate', 'The imperial court', 'The praetorian guard', 'The medieval parliament'], 0, 'Tribunes could protect plebeians and veto certain actions.'],
          ['What challenge grew as Rome expanded beyond a city-state?', ['Governing a larger, diverse territory', 'The disappearance of all political offices', 'The end of trade', 'A lack of military campaigns'], 0, 'Expansion placed new demands on institutions built around the city of Rome.'],
          ['How is the Republic’s end best understood?', ['A process of instability and civil conflict', 'A single peaceful election', 'The founding of Rome', 'A one-day change with no prior conflict'], 0, 'The shift to imperial rule followed decades of political crises and civil wars.'],
        ],
      },
      {
        title: 'From civil wars to emperors',
        summary: 'Follow the crises of the late Republic and the establishment of imperial rule.',
        content: `# From civil wars to emperors

In the first century BCE, political rivalries and military commands became entangled. Generals gained personal loyalty from armies, and civil wars weakened republican norms. Julius Caesar’s rise and assassination in 44 BCE did not restore stable republican government.

After further conflict, Octavian defeated his rivals. In 27 BCE he received the title Augustus and established a political settlement that preserved many republican offices while concentrating decisive power in the emperor. Historians call this system the Principate.

The transition was not an overnight replacement of every institution. The Senate and magistracies continued, but their authority operated within an imperial order. The arrangement provided long periods of stability while leaving succession and concentrated power as recurring challenges.`,
        flashcards: [
          ['Augustus', 'The title used by Octavian, Rome’s first emperor, beginning in 27 BCE.'],
          ['Principate', 'The early imperial system that retained republican forms while concentrating authority in the emperor.'],
        ],
        questions: [
          ['What title did Octavian receive in 27 BCE?', ['Augustus', 'Consul for life of the Republic', 'Dictator of Carthage', 'Pontifex of Greece'], 0, 'Octavian received the title Augustus and became Rome’s first emperor.'],
          ['What characterized the Principate?', ['Republican institutions continued while imperial power became dominant', 'All Roman offices vanished immediately', 'Rome returned to monarchy under the same kings', 'The Senate controlled every military decision'], 0, 'The early imperial system maintained republican forms alongside the emperor’s power.'],
          ['Why did Caesar’s assassination not restore the Republic?', ['Further conflicts and civil wars followed', 'Rome had no political institutions', 'Augustus had already been emperor for centuries', 'The empire had not yet been founded'], 0, 'The assassination was followed by more power struggles, not a stable return to earlier politics.'],
        ],
      },
      {
        title: 'Life and legacy in the empire',
        summary: 'Examine urban life, citizenship, infrastructure, and the diversity of Roman society.',
        content: `# Life and legacy in the empire

Roman society varied by region, status, gender, and wealth. Cities connected local communities to imperial administration and trade. Roads, ports, and aqueducts supported movement and urban life, but their construction relied on public resources and often coerced labor.

Roman citizenship expanded over time. In 212 CE, Emperor Caracalla extended citizenship to nearly all free inhabitants of the empire. This broadened legal identity without erasing differences in wealth, language, or local customs.

Rome’s legacy includes law, architecture, and political ideas, but it should not be treated as a direct, unchanged origin of modern institutions. Roman history also depended on conquest, slavery, and cultural exchange across a vast empire.`,
        flashcards: [
          ['Aqueduct', 'An engineered structure that carried water to settlements and cities.'],
          ['Edict of Caracalla', 'The 212 CE grant of Roman citizenship to nearly all free inhabitants of the empire.'],
        ],
        questions: [
          ['What did the Edict of Caracalla do?', ['Extended citizenship to nearly all free inhabitants of the empire', 'Ended slavery throughout Rome', 'Moved the capital to London', 'Dissolved all local communities'], 0, 'The 212 CE edict greatly expanded the number of Roman citizens.'],
          ['What is a careful way to describe Roman infrastructure?', ['It supported cities and movement but depended on resources and labor', 'It was built without public resources', 'It ended regional differences', 'It existed only in Rome itself'], 0, 'Infrastructure connected the empire, with real costs and unequal labor conditions.'],
          ['Which factor shaped Roman society across the empire?', ['Differences in status, region, wealth, and local custom', 'A single identical culture in every province', 'The absence of trade', 'Universal political equality'], 0, 'Roman society remained diverse despite shared institutions and imperial rule.'],
        ],
      },
    ],
  },
  'the-industrial-revolution': {
    description: 'Study how mechanization transformed production, cities, and labor.',
    lessons: [
      {
        title: 'Mechanization and factory production',
        summary: 'Understand why industrialization began in Britain and how production changed.',
        content: `# Mechanization and factory production

The Industrial Revolution began in Britain in the eighteenth century and spread unevenly. Access to coal, capital, trade networks, labor, and institutions helped create conditions for mechanization. No single invention explains the transformation.

In textiles, machines such as the spinning jenny and power loom increased output. Steam engines supplied power that was less tied to rivers, while factories brought workers and machinery together under coordinated schedules. Productivity and production scale changed, though hand production did not disappear at once.

Industrial growth depended on global trade, raw materials, and imperial power as well as local innovation. The benefits and costs were distributed unevenly among owners, workers, consumers, and the regions connected to industrial economies.`,
        flashcards: [
          ['Mechanization', 'Using machinery to perform or accelerate work previously done largely by hand.'],
          ['Factory system', 'Organizing workers and machines in centralized workplaces with coordinated production.'],
        ],
        questions: [
          ['Where did the Industrial Revolution begin?', ['Britain', 'Japan', 'The Roman Empire', 'The United States in the 1500s'], 0, 'The first industrial revolution is generally dated to eighteenth-century Britain.'],
          ['What changed with the factory system?', ['Workers and machines were coordinated in centralized workplaces', 'All production became household-based', 'Trade ceased', 'Steam power disappeared'], 0, 'Factories concentrated machinery and labor under coordinated schedules.'],
          ['Why is it inaccurate to credit one invention alone?', ['Industrialization depended on multiple technologies and social conditions', 'No inventions were used', 'Factories predated all tools', 'Coal was never used'], 0, 'Technology interacted with capital, resources, labor, trade, and institutions.'],
        ],
      },
      {
        title: 'Cities, work, and social change',
        summary: 'Explore urbanization, labor conditions, and new social relationships.',
        content: `# Cities, work, and social change

Industrial employment drew people toward towns and cities. Rapid urban growth often outpaced housing, sanitation, and public services. Conditions differed by place and period, but overcrowding and pollution became prominent concerns in many industrial centers.

Factory work could involve long hours, repetitive tasks, dangerous machinery, and low wages. Women and children also worked in many industries. Workers formed associations and unions, while reformers campaigned for limits on hours, safer workplaces, and broader access to education.

Industrial society reshaped class relations. Owners controlled capital and workplaces; wage earners depended on selling labor. Over time, political pressure and legislation changed labor conditions, but progress was contested and varied across countries.`,
        flashcards: [
          ['Urbanization', 'The growth of the share of a population living in towns and cities.'],
          ['Trade union', 'An organization through which workers collectively represent their interests.'],
        ],
        questions: [
          ['What often happened when cities grew rapidly during industrialization?', ['Housing and public services struggled to keep pace', 'Urban populations immediately declined', 'Pollution became impossible', 'All workers became factory owners'], 0, 'Rapid population growth could outpace infrastructure and services.'],
          ['Why did workers form unions?', ['To represent shared interests and negotiate collectively', 'To eliminate all forms of machinery', 'To prevent urbanization', 'To replace every government'], 0, 'Collective organization gave workers a way to advocate for wages and conditions.'],
          ['Which statement about industrial labor is accurate?', ['Conditions varied, and many workers faced long hours and hazards', 'Every worker had the same experience', 'Child labor never occurred', 'Labor laws appeared before factories'], 0, 'Experiences differed, but difficult and dangerous work was common in many settings.'],
        ],
      },
      {
        title: 'Transport, energy, and global effects',
        summary: 'Connect railways and fossil energy to industrial growth and global change.',
        content: `# Transport, energy, and global effects

Steam railways and improved canals reduced the time and cost of moving people and goods. Larger markets encouraged specialized production, and factories could obtain inputs and distribute goods over greater distances. Railways also required substantial capital, land, and engineering.

Coal powered steam engines and industrial furnaces, linking economic growth to fossil-fuel use. That energy transition increased productive capacity and also produced pollution and, over the long term, greenhouse gas emissions.

Industrialization was global, not confined to factory districts in Europe. It relied on raw materials, trade, colonial extraction, and changing power relationships. Different societies industrialized at different times and through distinct political choices; there was no single universal path.`,
        flashcards: [
          ['Fossil fuel', 'Energy source formed from ancient organic matter, such as coal, oil, or natural gas.'],
          ['Industrialization', 'A broad shift toward mechanized production and industrial economic organization.'],
        ],
        questions: [
          ['How did railways affect industrial markets?', ['They lowered the time and cost of moving goods and people', 'They eliminated the need for energy', 'They made production local only', 'They ended all trade'], 0, 'Railways connected producers and markets more quickly and at lower transport cost.'],
          ['Which energy source powered many early steam engines?', ['Coal', 'Solar panels', 'Uranium', 'Hydrogen fuel cells'], 0, 'Coal was a major fuel for steam power during early industrialization.'],
          ['Why should industrialization be viewed as global?', ['It involved international trade, raw materials, and colonial relationships', 'It occurred only in factories in Britain', 'It had no effect on other regions', 'It ended all global exchange'], 0, 'Industrial economies were tied to wider networks of extraction, trade, and power.'],
        ],
      },
    ],
  },
  'the-cold-war': {
    description: 'Follow the rivalry between the United States and Soviet Union from 1945 to 1991.',
    lessons: [
      {
        title: 'Origins of the Cold War',
        summary: 'Examine postwar tensions, competing systems, and the division of Europe.',
        content: `# Origins of the Cold War

After World War II, the United States and Soviet Union emerged as rival superpowers. Their alliance against Nazi Germany gave way to distrust over security, political systems, and influence in Europe. Historians debate the relative weight of ideology, security fears, and decisions by leaders on both sides.

Europe’s postwar division became a central arena. The Soviet Union supported governments aligned with its interests in Eastern Europe; the United States backed recovery and political partners in Western Europe. The Berlin Blockade of 1948–49 and the creation of NATO in 1949 deepened the division.

The term “Cold War” describes a prolonged rivalry without direct full-scale war between the two superpowers. It still involved arms competition, propaganda, espionage, and devastating conflicts elsewhere.`,
        flashcards: [
          ['NATO', 'A 1949 military alliance founded by the United States, Canada, and Western European states.'],
          ['Berlin Blockade', 'The Soviet closure of Western access routes to West Berlin in 1948–49.'],
        ],
        questions: [
          ['Why is the rivalry called the Cold War?', ['The superpowers avoided direct full-scale war with each other', 'No wars occurred anywhere', 'It was fought only in winter', 'It lasted for one year'], 0, 'The term distinguishes the superpower confrontation from a direct declared war between them.'],
          ['When was NATO founded?', ['1949', '1914', '1962', '1991'], 0, 'NATO was established in 1949.'],
          ['Which is a careful explanation of the Cold War’s origins?', ['A mix of security concerns, ideology, and political decisions', 'One event with no earlier causes', 'A conflict caused only by climate', 'A rivalry with no European dimension'], 0, 'Historians examine several interacting causes and debate their relative importance.'],
        ],
      },
      {
        title: 'Proxy conflicts and nuclear deterrence',
        summary: 'Understand proxy wars, alliance politics, and the risks of nuclear deterrence.',
        content: `# Proxy conflicts and nuclear deterrence

The superpowers competed globally, often supporting opposing sides in regional conflicts. These **proxy conflicts** were local wars with local causes; outside support intensified them but did not make local actors mere puppets. Korea and Vietnam became major Cold War conflicts with immense human costs.

The nuclear arms race created the possibility of catastrophic destruction. **Deterrence** rests on convincing an opponent that aggression would bring unacceptable costs. The doctrine of mutually assured destruction described a situation in which both sides retained the ability to retaliate after an attack.

Deterrence did not remove risk. Miscommunication, accidents, and escalation could still produce disaster. Arms-control agreements and communication channels sought to reduce some dangers while rivalry continued.`,
        flashcards: [
          ['Proxy conflict', 'A conflict in which outside powers support local sides while pursuing broader interests.'],
          ['Deterrence', 'Discouraging an action by making its expected costs unacceptable.'],
        ],
        questions: [
          ['What is a proxy conflict?', ['A local conflict in which outside powers support opposing sides', 'A war with no local participants', 'A diplomatic treaty', 'A conflict fought only by nuclear weapons'], 0, 'Proxy conflicts involve local causes and actors alongside external support.'],
          ['What is the purpose of deterrence?', ['To discourage attack by threatening unacceptable costs', 'To guarantee no accidents happen', 'To remove all weapons immediately', 'To begin a conflict'], 0, 'Deterrence aims to influence an opponent’s choices by shaping expected consequences.'],
          ['What risk remains even under nuclear deterrence?', ['Accidents or miscalculation could cause escalation', 'Nuclear weapons cannot be launched', 'Communication is always perfect', 'Arms races cannot occur'], 0, 'Deterrence does not eliminate error, misunderstanding, or escalation risk.'],
        ],
      },
      {
        title: 'Détente and the Cold War’s end',
        summary: 'Trace periods of eased tension, reform in the Soviet bloc, and the 1991 dissolution.',
        content: `# Détente and the Cold War’s end

**Détente** refers to periods when tensions eased and diplomatic engagement increased. Arms-control agreements such as SALT I limited aspects of strategic competition, though they did not end the arms race or resolve ideological conflict.

In the 1980s, Soviet leader Mikhail Gorbachev introduced reforms known as glasnost (greater openness) and perestroika (restructuring). Political change spread through Eastern Europe in 1989, including the fall of the Berlin Wall. These shifts arose from internal pressures and the changing international environment.

The Soviet Union dissolved in 1991, marking the end of the Cold War era. This outcome was not inevitable from the start; economic challenges, political choices, popular movements, and international developments all mattered. The legacy continued in new European institutions and unresolved conflicts.`,
        flashcards: [
          ['Détente', 'A period of reduced tension and increased diplomatic engagement between rivals.'],
          ['Glasnost', 'Gorbachev-era policy of greater openness in Soviet public life.'],
        ],
        questions: [
          ['What did détente describe?', ['Periods of reduced tension and increased diplomacy', 'The beginning of World War II', 'A military alliance', 'The permanent end of all rivalry'], 0, 'Détente eased some tensions but did not end the broader competition.'],
          ['Which event occurred in 1989?', ['The fall of the Berlin Wall', 'The founding of NATO', 'The Cuban Missile Crisis', 'The dissolution of the Soviet Union'], 0, 'The Berlin Wall opened and fell in 1989 amid political change in Eastern Europe.'],
          ['When did the Soviet Union dissolve?', ['1991', '1945', '1961', '2001'], 0, 'The Soviet Union dissolved in 1991.'],
        ],
      },
    ],
  },
  'color-theory': {
    description: 'Use color relationships, contrast, and accessibility to make deliberate visual choices.',
    lessons: [
      {
        title: 'Hue, value, and saturation',
        summary: 'Describe colors with hue, value, and saturation before choosing a palette.',
        content: `# Hue, value, and saturation

Color can be described by several dimensions. **Hue** is the color family, such as red or blue. **Value** describes relative lightness or darkness. **Saturation** describes intensity, from vivid to muted. Changing one dimension can alter the feeling and legibility of a design without changing the basic hue.

Color models serve different purposes. RGB mixes emitted light in screens; CMYK describes subtractive printing inks. A screen palette may not reproduce exactly on paper, so print work requires attention to profiles and proofing.

Palette relationships—complementary, analogous, or triadic—are starting points, not rules. A successful palette also considers hierarchy, context, surrounding colors, and the needs of people viewing it.`,
        flashcards: [
          ['Hue', 'The color family or position on a color wheel.'],
          ['Saturation', 'The intensity of a color, from vivid to muted.'],
        ],
        questions: [
          ['Which color dimension describes lightness or darkness?', ['Value', 'Hue', 'Saturation', 'Opacity'], 0, 'Value describes how light or dark a color appears.'],
          ['Which model is commonly used for light emitted by displays?', ['RGB', 'CMYK', 'Pantone only', 'Grayscale only'], 0, 'Screens combine red, green, and blue light.'],
          ['What is a sensible way to treat a color-wheel scheme?', ['As a starting point that still needs context and hierarchy', 'As a guarantee of accessible contrast', 'As a replacement for testing', 'As a rule that all designs must use three colors'], 0, 'Color harmonies can inspire choices but do not guarantee usability or meaning.'],
        ],
      },
      {
        title: 'Contrast and color relationships',
        summary: 'Build hierarchy with contrast and avoid relying on hue alone to convey meaning.',
        content: `# Contrast and color relationships

Contrast helps viewers distinguish elements and understand visual hierarchy. Differences in lightness often remain more legible than differences in hue alone, especially when content is viewed in grayscale or by people with color-vision differences.

Complementary colors sit opposite each other on a color wheel and can create strong contrast. Analogous colors sit near each other and often feel related. Either relationship can work, but adjacent colors with similar value may be hard to distinguish.

Use color alongside labels, shapes, or icons when communicating status. For example, a red error message should also include clear text or an icon. Test the design at realistic sizes and in different viewing conditions rather than judging only from a large, bright monitor.`,
        flashcards: [
          ['Complementary colors', 'Colors positioned opposite one another on a color wheel.'],
          ['Visual hierarchy', 'The arrangement of visual emphasis that guides attention through content.'],
        ],
        questions: [
          ['Why should color not be the only way to show an error?', ['Some users may not distinguish the color; labels add redundant cues', 'Color always disappears on screens', 'Text is never accessible', 'Errors should be hidden'], 0, 'Text, icons, and shape provide non-color cues that help more users.'],
          ['What relationship do complementary colors have?', ['They are opposite on a color wheel', 'They always have the same hue', 'They are identical in value', 'They cannot appear together'], 0, 'Complementary hues sit opposite each other on the wheel.'],
          ['Which contrast difference is often especially helpful for readability?', ['Lightness/value contrast', 'Tiny hue shifts only', 'Differences in file format', 'Differences in animation speed'], 0, 'Value contrast can remain perceptible even when hue distinctions are not.'],
        ],
      },
      {
        title: 'Accessible color in interfaces',
        summary: 'Check text contrast and design color choices for varied vision and contexts.',
        content: `# Accessible color in interfaces

Text needs sufficient contrast against its background. WCAG contrast ratios compare relative luminance; for common text, the minimum is 4.5:1, while large text generally requires 3:1. These thresholds are useful checks, not a substitute for testing the full interface.

Do not communicate important information by color alone. Add text labels, patterns, icons, or other cues, and keep focus states visible. Consider hover, disabled, and error states as well as the default screen. A palette may need separate foreground and background colors to meet contrast requirements.

Color perception varies with vision, lighting, display settings, and surroundings. Check the design with contrast tools and simulations, but remember that simulations do not represent every person’s experience. User testing and clear interaction design remain important.`,
        flashcards: [
          ['Contrast ratio', 'A luminance-based comparison between foreground and background colors.'],
          ['Redundant cue', 'A second way to convey information, such as a label alongside color.'],
        ],
        questions: [
          ['What is the WCAG contrast minimum for common body text?', ['4.5:1', '1:1', '2:1', '10:1'], 0, 'WCAG generally specifies 4.5:1 for normal text and 3:1 for large text.'],
          ['What is a good complement to color-coded status?', ['A text label or icon', 'A lower contrast ratio', 'A smaller font', 'An animation with no label'], 0, 'Redundant cues ensure the meaning is not conveyed by color alone.'],
          ['What does a contrast ratio compare?', ['Relative luminance of foreground and background colors', 'The number of colors in a palette', 'The file sizes of two images', 'The brightness of two unrelated displays'], 0, 'Contrast ratios are calculated from the relative luminance of two colors.'],
        ],
      },
    ],
  },
  'typography-essentials': {
    description: 'Use type scale, spacing, and readable measure to communicate with clarity.',
    lessons: [
      {
        title: 'Type anatomy and classification',
        summary: 'Identify basic letterform features and choose typefaces for their intended role.',
        content: `# Type anatomy and classification

Typography organizes written language so it can be read and understood. A **typeface** is a design of letterforms; a font is a particular digital or physical implementation of that design. Serif typefaces have small finishing strokes; sans-serif typefaces generally do not. These labels describe visual features, not a universal rule about readability.

Letter anatomy includes the baseline, x-height, ascenders, and descenders. A larger x-height can make lowercase letters appear more open at a given size. Weight and width also affect texture and emphasis.

Choose typefaces for the context, language support, and range of weights needed. A typeface that looks elegant in a heading may be less effective for dense interface text. Test actual copy, not just sample letters, and ensure the chosen font contains the characters your audience needs.`,
        flashcards: [
          ['X-height', 'The height of lowercase letters such as x relative to the body of a typeface.'],
          ['Typeface', 'A coordinated design of letterforms, often available in multiple font styles and weights.'],
        ],
        questions: [
          ['What is x-height?', ['The height of lowercase letters relative to the typeface body', 'The width of a page', 'The distance between paragraphs', 'The height of capital letters only'], 0, 'X-height describes the apparent height of lowercase letters such as x.'],
          ['Which statement about serif and sans-serif is accurate?', ['They describe letterform features, not a universal readability rule', 'Serif fonts are always more readable', 'Sans-serif fonts cannot be used for body text', 'They describe text alignment'], 0, 'Readability depends on context and implementation, not classification alone.'],
          ['What should be checked when choosing a typeface for an audience?', ['Language and character coverage', 'Only the font’s file name', 'Whether it has exactly one weight', 'The screen’s wallpaper'], 0, 'Font coverage should support the scripts and characters readers need.'],
        ],
      },
      {
        title: 'Hierarchy, scale, and spacing',
        summary: 'Create typographic hierarchy with size, weight, alignment, and consistent spacing.',
        content: `# Hierarchy, scale, and spacing

Typographic hierarchy helps readers scan and understand relationships. Size, weight, color, and spacing can distinguish a page title from a section heading and body copy. Use a limited, consistent scale so emphasis feels intentional rather than arbitrary.

Line height affects how easily a reader tracks from one line to the next. Long text often needs more line spacing than compact headings. Alignment also matters: left-aligned text is usually easier to scan in left-to-right languages than fully justified text with uneven word spacing.

Spacing groups related items and separates different sections. Establish a rhythm with repeatable values, then adjust where content needs it. Hierarchy should remain apparent when users zoom or when the layout changes on a smaller screen.`,
        flashcards: [
          ['Typographic hierarchy', 'Visual distinctions that communicate the relative importance of text.'],
          ['Line height', 'The vertical distance between baselines of successive lines of text.'],
        ],
        questions: [
          ['What is the purpose of typographic hierarchy?', ['Show the relative importance and relationships of text', 'Make every line the same size', 'Remove all whitespace', 'Guarantee every reader scans identically'], 0, 'Hierarchy guides scanning by distinguishing roles and importance.'],
          ['What can excessive line length make harder?', ['Tracking from one line to the next', 'Loading a font file', 'Changing text color', 'Displaying a heading'], 0, 'Long lines make it harder for readers to find the start of the next line.'],
          ['Why use a consistent type scale?', ['To make emphasis and relationships feel systematic', 'To prohibit responsive design', 'To prevent all font loading', 'To force every paragraph to match'], 0, 'A coherent scale supports predictable hierarchy across a design.'],
        ],
      },
      {
        title: 'Readable text in responsive interfaces',
        summary: 'Test typography across devices, languages, and accessibility settings.',
        content: `# Readable text in responsive interfaces

Readable interface typography depends on more than a nominal font size. Line length, contrast, spacing, font rendering, and the user’s display all contribute. Avoid fixed layouts that clip text when users increase font size or browser zoom.

Use relative sizing and allow content to reflow. Buttons and navigation need enough space for translated labels, which may be longer than the original. Line breaks should not depend on a particular screen width or a single language.

Test with real content on phones and larger screens, at increased zoom, and with assistive technologies where relevant. Good typography supports the task: users should be able to read instructions, distinguish controls, and recover from errors without relying on visual styling alone.`,
        flashcards: [
          ['Reflow', 'A layout adapting content to the available viewport without requiring horizontal scrolling for ordinary text.'],
          ['Responsive typography', 'Type sizing and layout that adapt to different viewports and user settings.'],
        ],
        questions: [
          ['Why should a layout tolerate text zoom?', ['Users may need larger text, and content should remain usable', 'Zoom is only for images', 'It makes every page identical', 'Browsers do not support zoom'], 0, 'Supporting zoom is important for users who need larger text.'],
          ['Why test translated interface labels?', ['Translations can be longer and change the layout', 'All translations have the same length', 'Fonts never affect language support', 'Translations remove the need for buttons'], 0, 'Text expansion can expose clipping or overflow in fixed layouts.'],
          ['What does responsive typography aim to do?', ['Keep text legible and usable across viewports and settings', 'Lock every font size to one pixel value', 'Prevent users from resizing text', 'Replace semantic headings'], 0, 'Responsive typography adapts while preserving readability and hierarchy.'],
        ],
      },
    ],
  },
  'design-systems': {
    description: 'Create reusable design foundations and components that evolve consistently.',
    lessons: [
      {
        title: 'Tokens and foundations',
        summary: 'Use design tokens to name and consistently apply foundational design decisions.',
        content: `# Tokens and foundations

A design system is a shared set of principles, foundations, components, and guidance for building a product. **Design tokens** give meaningful names to recurring values such as color, spacing, typography, and corner radius. A token like “color-text-primary” communicates intent more clearly than repeating a raw color code.

Tokens help designers and developers keep interfaces consistent and make broad changes easier. Separate semantic tokens—what a value is for—from raw palette values—what it looks like. A dark theme can then map the same semantic role to a different color.

Tokens are not valuable merely because they exist. They need clear ownership, documentation, and a workflow for change. Start with repeated decisions that matter, and avoid creating a token for every one-off detail.`,
        flashcards: [
          ['Design token', 'A named, reusable value for a design decision such as color or spacing.'],
          ['Semantic token', 'A token named for its purpose, such as primary text or surface background.'],
        ],
        questions: [
          ['What is a benefit of semantic design tokens?', ['They name a value by its role and can map differently across themes', 'They force all products to use one color', 'They remove the need for documentation', 'They only work for typography'], 0, 'Semantic roles let implementations change while components retain meaning.'],
          ['Which is a good candidate for a design token?', ['A spacing value reused across many components', 'A one-time pixel adjustment on an unused mockup', 'Every mouse position', 'A user’s password'], 0, 'Tokens are most helpful for decisions that recur and benefit from consistency.'],
          ['What should accompany a token system?', ['Documentation and a process for ownership and change', 'No naming conventions', 'A guarantee that design never changes', 'Only raw hexadecimal values'], 0, 'Tokens need shared meaning and maintenance to stay useful.'],
        ],
      },
      {
        title: 'Reusable components and patterns',
        summary: 'Design components around clear responsibilities, variants, and accessible behavior.',
        content: `# Reusable components and patterns

Components package interface structure and behavior for repeated use: buttons, inputs, alerts, and navigation are common examples. Good components expose a small set of meaningful variants rather than a unique option for every screen.

Patterns describe how components work together to solve a user need, such as confirming a destructive action. Reuse should not erase context: a shared dialog still needs a specific title, clear consequences, and accessible focus behavior.

Components should be tested for keyboard interaction, semantics, content variation, and responsive states. Document intended use and anti-patterns. If teams repeatedly need exceptions, revisit the component API instead of accumulating undocumented overrides.`,
        flashcards: [
          ['Component variant', 'A supported visual or behavioral variation of a reusable component.'],
          ['Design pattern', 'A repeatable solution for a recurring interaction or interface problem.'],
        ],
        questions: [
          ['What is a good reason to create a component variant?', ['A recurring, meaningful difference in behavior or presentation', 'A one-off override no one will reuse', 'To expose every CSS property to every user', 'To avoid testing'], 0, 'Variants should represent stable, useful differences.'],
          ['What should a destructive-action dialog communicate?', ['The action and its consequences clearly', 'Only an unexplained icon', 'A hidden confirmation button', 'A different font family'], 0, 'Users need to understand what will happen before confirming an irreversible action.'],
          ['Which behavior should reusable interactive components support?', ['Keyboard access and meaningful semantics', 'Mouse use only', 'No focus state', 'A fixed screen width'], 0, 'Accessible semantics and keyboard behavior are fundamental component requirements.'],
        ],
      },
      {
        title: 'Governance and evolution',
        summary: 'Keep a design system useful through contribution, versioning, and adoption feedback.',
        content: `# Governance and evolution

Design systems evolve as products and teams change. Governance defines how proposals are reviewed, who maintains shared foundations, and how breaking changes are communicated. Good governance enables contribution without allowing inconsistent changes to accumulate unnoticed.

Measure usefulness through adoption, quality, and developer and designer feedback—not component counts alone. A system that is difficult to discover or adapt may be bypassed. Examples, accessibility guidance, and migration instructions can be as important as the code itself.

Version shared packages deliberately. Deprecate old APIs with a clear migration path, and leave room for product-specific needs when a shared abstraction would be harmful. A design system is a service to its users, not a goal of standardizing every detail.`,
        flashcards: [
          ['Governance', 'The roles and processes used to propose, review, maintain, and evolve a design system.'],
          ['Deprecation', 'A communicated phase-out of an API before it is eventually removed.'],
        ],
        questions: [
          ['What is the purpose of design-system governance?', ['Make shared changes accountable and contributions predictable', 'Prevent all contributions', 'Guarantee every product looks identical', 'Replace user research'], 0, 'Governance clarifies ownership, review, and evolution of shared assets.'],
          ['Why provide a migration path when deprecating a component API?', ['Teams need a practical way to move to the supported alternative', 'It hides the change', 'It prevents versioning', 'It guarantees no code changes'], 0, 'Clear migration guidance reduces disruption and encourages adoption.'],
          ['Which is a useful measure of design-system health?', ['Adoption and user-team feedback alongside quality', 'The number of components alone', 'The number of colors in a logo', 'How rarely documentation changes'], 0, 'Usage, quality, and feedback show whether the system helps its users.'],
        ],
      },
    ],
  },
};
