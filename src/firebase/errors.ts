export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  constructor(public context: SecurityRuleContext, serverError: Error) {
    const baseMessage = `FirestoreError: Missing or insufficient permissions.`;
    // The auth object in the error is too complex to construct on the client without accessing sensitive info.
    // The developer can see the auth context in the Firestore Emulator UI's 'Requests' tab.
    const contextMessage = `The following request was denied by Firestore Security Rules:\n${JSON.stringify(
      {
        auth: "See Authentication tab in the Firebase console or Emulator UI for user details.",
        method: context.operation,
        path: `/databases/(default)/documents/${context.path}`,
        time: new Date().toISOString(),
        ...(context.requestResourceData && {
          resource: { data: context.requestResourceData },
        }),
      },
      null,
      2
    )}`;
    
    // Combine the base Firebase error with our custom context.
    super(`${baseMessage}\n${contextMessage}\n\nOriginal error: ${serverError.message}`);
    this.name = 'FirestorePermissionError';
    // Preserve the original stack trace if available.
    if (serverError.stack) {
        this.stack = serverError.stack;
    }
  }
}
