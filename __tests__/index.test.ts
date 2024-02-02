/**
 * Unit tests for the action's main functionality, src/index.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('succeed', async () => {
    expect(true).toBeTruthy()
  })
})
