/* MarginMate — landed cost & margin calculator. No deps, no network. */
(function () {
  "use strict";

  var CUR = {
    INR: { currency: "INR", locale: "en-IN", sym: "₹" },
    PHP: { currency: "PHP", locale: "en-PH", sym: "₱" }
  };

  function el(id) { return document.getElementById(id); }

  function num(id) {
    var e = el(id);
    if (!e) return 0;
    var v = parseFloat(e.value);
    if (!isFinite(v) || v < 0) return 0;
    return v;
  }

  function activeCur() {
    var b = document.querySelector('#seg-cur button[aria-pressed="true"]');
    var k = b ? b.getAttribute("data-cur") : "INR";
    return CUR[k] || CUR.INR;
  }

  function recoverable() {
    var b = document.querySelector('#seg-rec button[aria-pressed="true"]');
    return !!(b && b.getAttribute("data-rec") === "yes");
  }

  function pct(n) {
    if (!isFinite(n)) return "—";
    return n.toFixed(2) + "%";
  }

  function trim(n) {
    if (!isFinite(n)) n = 0;
    return String(Math.round(n * 100) / 100);
  }

  function setText(id, s) {
    var e = el(id);
    if (e) e.textContent = s;
  }

  function setNeg(id, on) {
    var e = el(id);
    if (e) e.classList.toggle("neg", !!on);
  }

  function recompute() {
    var c = activeCur();
    var fmt;
    try {
      fmt = new Intl.NumberFormat(c.locale, { style: "currency", currency: c.currency });
    } catch (err) {
      fmt = null;
    }
    function M(n) {
      if (!isFinite(n)) n = 0;
      return fmt ? fmt.format(n) : c.sym + n.toFixed(2);
    }

    // currency symbol in the input prefixes
    var pres = document.querySelectorAll(".inp.has-pre .pre.cur");
    for (var i = 0; i < pres.length; i++) pres[i].textContent = c.sym;

    var purchase = num("purchase");
    var free = num("free");
    var bought = num("bought");
    if (!(bought > 0)) bought = 1; // units bought defaults to 1

    var gstP = num("gst");
    var freight = num("freight");
    var other = num("other");
    var mrp = num("mrp");
    var target = num("target");
    var rec = recoverable();

    var denom = bought + free;
    var effPurchase = denom > 0 ? (purchase * bought) / denom : 0;
    var gstAmt = effPurchase * (gstP / 100);
    var gstInLanded = rec ? 0 : gstAmt;
    var landed = effPurchase + gstInLanded + freight + other;

    // primary + break-even
    setText("r-landed", M(landed));
    setText("r-sub", "Break-even " + M(landed) + " per unit");

    // breakdown
    setText("b-eff", M(effPurchase));
    setText("b-gst-label", rec
      ? "GST / VAT (" + trim(gstP) + "% — recoverable, excluded)"
      : "GST / VAT (" + trim(gstP) + "% — included)");
    setText("b-gst", M(gstAmt));
    var gstRow = el("b-gst-row");
    if (gstRow) gstRow.classList.toggle("sub", rec); // muted when excluded from landed
    setText("b-freight", M(freight));
    setText("b-other", M(other));
    setText("b-total", M(landed));

    // at your selling price (only when MRP entered)
    var sell = el("sellblock");
    var warn = el("neg-warn");
    if (mrp > 0) {
      if (sell) sell.hidden = false;
      var marginSp = ((mrp - landed) / mrp) * 100; // mrp > 0 so safe
      var markup = landed > 0 ? ((mrp - landed) / landed) * 100 : NaN;
      setText("m-margin", pct(marginSp));
      setNeg("m-margin", marginSp < 0);
      setText("m-markup", pct(markup));
      setNeg("m-markup", isFinite(markup) && markup < 0);
      if (warn) warn.hidden = !(landed > mrp); // selling below landed cost
    } else {
      if (sell) sell.hidden = true;
      if (warn) warn.hidden = true;
    }

    // suggested price for target margin on selling price (guard target < 100)
    var sug = el("suggest");
    if (target > 0 && target < 100) {
      if (sug) sug.hidden = false;
      setText("s-target", trim(target));
      setText("s-srp", M(landed / (1 - target / 100)));
    } else {
      if (sug) sug.hidden = true;
    }
  }

  function wireSeg(segId) {
    var seg = el(segId);
    if (!seg) return;
    var btns = seg.querySelectorAll("button");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        for (var j = 0; j < btns.length; j++) {
          btns[j].setAttribute("aria-pressed", btns[j] === this ? "true" : "false");
        }
        recompute();
      });
    }
  }

  // recompute on every input event
  var inputs = document.querySelectorAll('input[type="number"]');
  for (var k = 0; k < inputs.length; k++) {
    inputs[k].addEventListener("input", recompute);
  }

  wireSeg("seg-cur");
  wireSeg("seg-rec");

  var printBtn = el("print");
  if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

  var resetBtn = el("reset");
  if (resetBtn) resetBtn.addEventListener("click", function () {
    var ins = document.querySelectorAll('input[type="number"]');
    for (var m = 0; m < ins.length; m++) ins[m].value = "";
    recompute();
  });

  recompute();
})();
