/* Investment Options — educational content only (DOM render, no calculations).
   No specific products, providers, rates or minimums are claimed as verified/current —
   every figure below is a general range, labeled as such, per the spec's "only show
   verified info" requirement. This never executes a real investment. */
const INVESTMENT_OPTIONS = [
  {
    type: 'Bank deposits (time deposits)',
    summary: 'You lock money with a bank for a fixed term in exchange for a fixed interest rate.',
    risk: 'Low',
    riskNote: 'Usually covered by deposit insurance up to a limit — check the current limit with your bank or regulator.',
    horizon: 'Often 1 month to 1 year.',
    liquidity: 'Low until the term ends — withdrawing early usually costs a penalty or forfeits interest.',
    minimum: 'Varies by bank, commonly Rp1.000.000 and up. Confirm with your bank — not a verified live figure.',
    fees: 'Usually none, aside from an early-withdrawal penalty.'
  },
  {
    type: 'Money-market mutual funds',
    summary: 'A fund pooling money into very short-term, low-risk instruments like bank deposits and short government debt.',
    risk: 'Low',
    riskNote: 'Among the lowest-risk fund types, but value can still move slightly and isn’t insured like a bank deposit.',
    horizon: 'Days to a few months — built for short-term, easy-access saving.',
    liquidity: 'High — many can be redeemed within 1–2 business days.',
    minimum: 'Often low through an app-based platform, sometimes under Rp100.000. Confirm with your provider.',
    fees: 'A small management fee, usually built into the fund’s reported return.'
  },
  {
    type: 'Bond / fixed-income funds',
    summary: 'A fund holding government or corporate bonds, aiming for steadier returns than stocks with more risk than deposits.',
    risk: 'Low–Moderate',
    riskNote: 'Bond prices can fall when interest rates rise, so the value can dip, especially short-term.',
    horizon: 'Often 1–5 years — better suited to medium-term goals.',
    liquidity: 'Moderate — usually redeemable within a few business days, but value isn’t fixed.',
    minimum: 'Varies by provider. Confirm with your provider — not a verified live figure.',
    fees: 'An annual management fee, which varies by fund.'
  },
  {
    type: 'Equity (stock) funds',
    summary: 'A fund investing in company shares, aiming for higher long-term growth with larger short-term swings.',
    risk: 'High',
    riskNote: 'Value can drop significantly in the short term. Best suited to money you won’t need for several years.',
    horizon: 'Often 5+ years, to ride out market ups and downs.',
    liquidity: 'Moderate — redeemable within a few business days, but you may be selling at a loss if the market is down.',
    minimum: 'Varies by provider. Confirm with your provider — not a verified live figure.',
    fees: 'An annual management fee, typically higher than bond or money-market funds.'
  }
];

function ioRow(label, value){
  return '<div class="row" style="margin-bottom:6px;align-items:flex-start;gap:10px;">'
    + '<span style="font-size:12px;color:var(--text-secondary);flex-shrink:0;">' + label + '</span>'
    + '<span style="font-size:12px;text-align:right;">' + value + '</span></div>';
}

function investmentOptionCard(o){
  const riskColor = o.risk === 'Low' ? 'teal' : (o.risk === 'High' ? 'coral' : 'amber');
  return '<div class="card outline">'
    + '<div class="row" style="margin-bottom:6px;"><span style="font-size:14px;font-weight:600;">' + o.type + '</span>'
    + '<span class="pill" style="background:var(--' + riskColor + '-bg);color:var(--' + riskColor + '-dark);">' + o.risk + ' risk</span></div>'
    + '<p style="font-size:12px;color:var(--text-secondary);margin:0 0 10px;">' + o.summary + '</p>'
    + '<div class="divider"></div>'
    + ioRow('Risk', o.riskNote)
    + ioRow('Time horizon', o.horizon)
    + ioRow('Liquidity', o.liquidity)
    + ioRow('Minimum', o.minimum)
    + ioRow('Fees', o.fees).replace('margin-bottom:6px;', '')
    + '</div>';
}

function renderInvestmentOptions(){
  const el = document.getElementById('io-current');
  if(el) el.textContent = formatRp(typeof getPocket === 'function' && getPocket(2) ? pocketBalance(2) : 0);
  const list = document.getElementById('io-list');
  if(list) list.innerHTML = INVESTMENT_OPTIONS.map(investmentOptionCard).join('');
}
