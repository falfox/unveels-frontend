export const FaceShader = {
  vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = vec2(1.0 - uv.x, uv.y);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
  fragmentShader: `
            varying vec2 vUv;
            uniform sampler2D videoTexture;
            uniform vec2 leftEyebrow[4];
            uniform vec2 rightEyebrow[4];
            uniform float archFactor;
            uniform float pinchFactor;
            uniform float horizontalShiftFactor;
            uniform float verticalShiftFactor;

            void main() {
                vec2 uv = vUv;

                // Apply horizontal shift effect to left eyebrow
                for (int i = 0; i < 4; i++) {
                    float dist = distance(uv, leftEyebrow[i]);
                    if (dist < 0.06) {
                        uv.x += horizontalShiftFactor * (0.06 - dist);
                    }
                }

                // Apply horizontal shift effect to right eyebrow
                for (int i = 0; i < 4; i++) {
                    float dist = distance(uv, rightEyebrow[i]);
                    if (dist < 0.06) {
                        uv.x -= horizontalShiftFactor * (0.06 - dist);
                    }
                }

                // Apply vertical shift effect to left eyebrow
                for (int i = 0; i < 4; i++) {
                    float dist = distance(uv, leftEyebrow[i]);
                    if (dist < 0.06) {
                        uv.y += verticalShiftFactor * (0.06 - dist);
                    }
                }

                // Apply vertical shift effect to right eyebrow
                for (int i = 0; i < 4; i++) {
                    float dist = distance(uv, rightEyebrow[i]);
                    if (dist < 0.06) {
                        uv.y += verticalShiftFactor * (0.06 - dist);
                    }
                }

                // Apply arch effect to left eyebrow
                for (int i = 0; i < 4; i++) {
                    float dist = distance(uv, leftEyebrow[i]);
                    if (dist < 0.05) {
                        uv.y -= archFactor * (0.05 - dist);
                    }
                }

                // Apply arch effect to right eyebrow
                for (int i = 0; i < 4; i++) {
                    float dist = distance(uv, rightEyebrow[i]);
                    if (dist < 0.05) {
                        uv.y -= archFactor * (0.05 - dist);
                    }
                }

                // Apply pinch effect to left eyebrow
                for (int i = 0; i < 4; i++) {
                    float dist = distance(uv, leftEyebrow[i]);
                    if (dist < 0.04) {
                        uv += pinchFactor * (uv - leftEyebrow[i]) * (0.04 - dist);
                    }
                }

                // Apply pinch effect to right eyebrow
                for (int i = 0; i < 4; i++) {
                    float dist = distance(uv, rightEyebrow[i]);
                    if (dist < 0.04) {
                        uv += pinchFactor * (uv - rightEyebrow[i]) * (0.04 - dist);
                    }
                }

                gl_FragColor = texture2D(videoTexture, uv);
            }
    `,
};
