/* G7.5 TEST-only, no network, no student data, no deployment. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.G75VietnameseSpeechService = api.VietnameseSpeechService;
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";
  function VietnameseSpeechService(env, notify) {
    this.env = env || (typeof window !== "undefined" ? window : {});
    this.notify = typeof notify === "function" ? notify : function () {};
    this.synth = this.env.speechSynthesis || null;
    this.active = null;
    this.sequence = 0;
    this._voicesChanged = this.refreshVoices.bind(this);
    this.voices = [];
    this.voice = null;
    this.refreshVoices();
    if (this.synth && typeof this.synth.addEventListener === "function") {
      this.synth.addEventListener("voiceschanged", this._voicesChanged);
    } else if (this.synth && "onvoiceschanged" in this.synth) {
      var former = this.synth.onvoiceschanged;
      this.synth.onvoiceschanged = function (event) {
        if (typeof former === "function") former.call(this, event);
        this._voicesChanged();
      }.bind(this);
    }
  }
  VietnameseSpeechService.prototype.available = function () {
    return Boolean(this.synth && typeof this.synth.speak === "function" &&
      typeof this.env.SpeechSynthesisUtterance === "function");
  };
  VietnameseSpeechService.prototype.refreshVoices = function () {
    try {
      this.voices = this.synth && this.synth.getVoices ? this.synth.getVoices() || [] : [];
    } catch (error) { this.voices = []; }
    this.voice = this.voices.find(function(v) { return /^vi[-_]vn$/i.test(v.lang || ""); }) ||
      this.voices.find(function(v) { return /^vi(?:[-_]|$)/i.test(v.lang || ""); }) || null;
    return this.voice;
  };
  VietnameseSpeechService.prototype.getCapabilities = function () {
    this.refreshVoices();
    return { supported:this.available(), voiceCount:this.voices.length,
      hasVietnameseVoice:Boolean(this.voice), selectedVoice:this.voice ? this.voice.name : null,
      selectedLang:this.voice ? this.voice.lang : null };
  };
  VietnameseSpeechService.prototype.stop = function () {
    ++this.sequence;
    if (this.active) {
      var previous = this.active;
      this.active = null;
      this.notify({ requestId:previous.id, status:"CANCELLED" });
    }
    if (this.synth && typeof this.synth.cancel === "function") this.synth.cancel();
  };
  VietnameseSpeechService.prototype.speak = function (text, purpose) {
    this.stop();
    var id = "g75-" + this.sequence;
    if (!this.available()) { this.notify({requestId:id,status:"UNSUPPORTED"}); return "UNSUPPORTED"; }
    if (!this.refreshVoices()) {
      var status = this.voices.length ? "NO_VI_VOICE" : "VOICE_LOADING_OR_UNAVAILABLE";
      this.notify({requestId:id,status:status}); return status;
    }
    if (typeof text !== "string" || !text.trim()) {
      this.notify({requestId:id,status:"INVALID_TEXT"}); return "INVALID_TEXT";
    }
    var utter = new this.env.SpeechSynthesisUtterance(text.trim());
    utter.lang = "vi-VN"; utter.voice = this.voice;
    utter.rate = 0.9; utter.pitch = 1.0;
    this.active = {id:id, utterance:utter};
    var self = this;
    function emit(status, extra) {
      if (!self.active || self.active.id !== id) return;
      self.notify(Object.assign({requestId:id,status:status,voiceName:utter.voice.name,
        voiceLang:utter.voice.lang,purpose:purpose || "PROMPT"},extra || {}));
      if (status === "ENDED" || status === "ERROR") self.active = null;
    }
    utter.onstart = function () { emit("STARTED"); };
    utter.onend = function () { emit("ENDED"); };
    utter.onerror = function (event) { emit("ERROR",{errorCode:String(event.error || "unknown")}); };
    try { this.synth.speak(utter); emit("REQUESTED"); return "REQUESTED"; }
    catch (error) { emit("ERROR",{errorCode:"speak_exception"}); return "ERROR"; }
  };
  VietnameseSpeechService.prototype.destroy = function () {
    this.stop();
    if (this.synth && typeof this.synth.removeEventListener === "function")
      this.synth.removeEventListener("voiceschanged",this._voicesChanged);
  };
  return {VietnameseSpeechService:VietnameseSpeechService};
});
