class RecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = [];
  }

  process(inputs) {
    const input = inputs[0];
    if (input.length > 0) {
      const channelData = input[0]; // mono
      this.port.postMessage(channelData); // PCM 데이터 전달
    }
    return true; // 계속 실행
  }
}

registerProcessor("recorder-processor", RecorderProcessor);
