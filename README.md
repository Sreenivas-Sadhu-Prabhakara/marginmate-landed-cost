# MarginMate — Landed Cost Calculator

A single-page tool that turns a supplier price — including free goods, tax, freight and other per-unit costs — into your **true landed cost per unit**, your **break-even**, and your **real margin** at any selling price. It also suggests a selling price for a target margin.

The page is both the working calculator and its own explainer. Everything runs in the browser: no accounts, no data leaves the device, no network calls.

## What it computes

- **Effective purchase** after free goods: `price × bought ÷ (bought + free)` per unit.
- **Landed cost**: effective purchase + GST/VAT (when it is a cost to you) + freight + other cost.
- **Break-even**: equal to landed cost — the price below which each unit loses money.
- **Margin on selling price**: `(price − landed) ÷ price`.
- **Markup on cost**: `(price − landed) ÷ landed`.
- **Suggested price** for a target margin on the selling price: `landed ÷ (1 − target%)`.

Currency can be switched between Indian rupee (₹ INR) and Philippine peso (₱ PHP).

## Who it's for

Kirana shops, distributors, resellers and other small retailers in **India** and the **Philippines** who buy on supplier terms (with free goods and tax) and need to know their true cost and the right selling price.

## The tax rule it models

Whether GST/VAT is part of your cost depends on your registration:

- **India — GST** (Goods and Services Tax): a registered business can usually claim the GST it pays on purchases as **input tax credit (ITC)**, so that tax is not a cost and is **excluded** from landed cost. A small or unregistered seller who cannot claim ITC pays the tax and keeps it as a cost, so it is **included**.
- **Philippines — VAT** (Value-Added Tax): a VAT-registered business claims input VAT the same way (excluded); a non-VAT / unregistered seller bears it (included).

The **recoverability toggle** lets you pick the case that matches you. The default is *Not recoverable*, which fits small, unregistered sellers.

## How to run

Serve the folder with any static file server and open it in a browser:

```sh
python3 -m http.server 8137
```

Then visit `http://localhost:8137/`. No build step and no dependencies — the files are plain HTML, CSS and JavaScript.

## Scope & accuracy

This is a quick planning estimate, not tax, accounting or legal advice. It models tax as a flat percentage of the effective purchase price and assumes freight and other costs are entered tax-inclusive and per unit. It does not handle multi-tax invoices, partial input-tax eligibility, reverse charge, cess, or currency conversion. Confirm the actual rates, your input-tax eligibility, and the figures on your own invoices, and check with a qualified adviser before pricing or filing.

MIT licensed.
