export interface DailyFact {
  category: string;
  text: string;
  source: string;
  sourceUrl: string;
}

const DAILY_FACTS: DailyFact[] = [
  {
    category: 'Science',
    text: 'Venus is hotter than Mercury, even though Mercury is closer to the Sun. Venus’s thick atmosphere traps heat in a runaway greenhouse effect.',
    source: 'NASA: Venus facts',
    sourceUrl: 'https://science.nasa.gov/venus/venus-facts/',
  },
  {
    category: 'Science',
    text: 'The Moon is slowly moving away from Earth by about an inch each year.',
    source: 'NASA: Moon facts',
    sourceUrl: 'https://science.nasa.gov/moon/facts/',
  },
  {
    category: 'Science',
    text: 'Titan, Saturn’s largest moon, has lakes and seas made of liquid methane and ethane.',
    source: 'NASA: Titan',
    sourceUrl: 'https://science.nasa.gov/saturn/moons/titan/',
  },
  {
    category: 'Technology',
    text: 'The first website is still online at CERN, where the World Wide Web was invented.',
    source: 'CERN: the first website',
    sourceUrl: 'http://info.cern.ch/',
  },
  {
    category: 'Technology',
    text: 'The QR code was invented in Japan in 1994 to track automotive parts during manufacturing.',
    source: 'DENSO WAVE: QR code history',
    sourceUrl: 'https://www.qrcode.com/en/history/',
  },
  {
    category: 'Finance',
    text: 'The Rule of 72 is a quick estimate: divide 72 by an annual percentage return to approximate how many years it takes an investment to double.',
    source: 'Investopedia: Rule of 72',
    sourceUrl: 'https://www.investopedia.com/terms/r/ruleof72.asp',
  },
  {
    category: 'Finance',
    text: 'With compound interest, interest can earn interest too—so the balance can grow faster over time than with simple interest.',
    source: 'Investor.gov: compound interest calculator',
    sourceUrl:
      'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator',
  },
  {
    category: 'History',
    text: 'Teaching at the University of Oxford is recorded as early as 1096, making it one of the oldest universities in the world.',
    source: 'University of Oxford: history',
    sourceUrl: 'https://www.ox.ac.uk/about/organisation/history',
  },
  {
    category: 'History',
    text: 'The Rosetta Stone, discovered in 1799, carries the same decree in three scripts and helped scholars decipher Egyptian hieroglyphs.',
    source: 'British Museum: Rosetta Stone',
    sourceUrl: 'https://www.britishmuseum.org/collection/object/Y_EA24',
  },
  {
    category: 'Design',
    text: 'Harry Beck’s London Underground map replaced geographic accuracy with clear lines and station order, making the network easier to navigate.',
    source: 'London Transport Museum: Harry Beck',
    sourceUrl: 'https://www.ltmuseum.co.uk/collections/stories/people/harry-beck',
  },
  {
    category: 'Design',
    text: 'Helvetica was first released in 1957 under the name Neue Haas Grotesk.',
    source: 'Encyclopaedia Britannica: Helvetica',
    sourceUrl: 'https://www.britannica.com/topic/Helvetica-typeface',
  },
];

export function getDailyFact(date: string, category?: string): DailyFact {
  const [year, month, day] = date.split('-').map(Number);
  const dateValue = new Date(Date.UTC(year ?? NaN, (month ?? NaN) - 1, day ?? NaN));

  if (
    !Number.isFinite(dateValue.getTime()) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    dateValue.toISOString().slice(0, 10) !== date
  ) {
    throw new Error(`Invalid daily fact date: "${date}".`);
  }

  const dayNumber = dateValue.getTime() / 86_400_000;
  const matchingFacts = category
    ? DAILY_FACTS.filter((fact) => fact.category.toLowerCase() === category.trim().toLowerCase())
    : [];
  const facts = matchingFacts.length > 0 ? matchingFacts : DAILY_FACTS;
  const index = ((Math.floor(dayNumber) % facts.length) + facts.length) % facts.length;

  return facts[index]!;
}
