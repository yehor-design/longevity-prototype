import { prototypeConfig, PROTOTYPE_MODE } from "@/lib/prototype";

/**
 * Returns prototype bypass flags for use in components and forms.
 * In production mode all flags return false.
 */
export function usePrototypeBypass() {
  if (!PROTOTYPE_MODE) {
    return {
      isPrototype: false,
      autoAcceptOtp: false,
      fakeGoogleOAuth: false,
      allFieldsOptional: false,
      skipFormatValidation: false,
    };
  }

  return {
    isPrototype: true,
    autoAcceptOtp: prototypeConfig.autoAcceptOtp,
    fakeGoogleOAuth: prototypeConfig.fakeGoogleOAuth,
    allFieldsOptional: prototypeConfig.allFieldsOptional,
    skipFormatValidation: prototypeConfig.skipFormatValidation,
  };
}
