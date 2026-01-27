/**
 * Pool-layer mapping (independent + crop-able):
 * - Nation -> ELF_POOLS.nation + ELF_BIASES.nation
 * - Origin -> ELF_POOLS.origin + ELF_BIASES.origin
 * - Era -> ELF_POOLS.era + ELF_BIASES.era
 * - Gender -> ELF_POOLS.gender + ELF_BIASES.gender
 * - Context -> ELF_POOLS.context + ELF_BIASES.context
 * - Form -> ELF_POOLS.form + ELF_BIASES.form
 * - Style -> ELF_POOLS.style + ELF_BIASES.style
 * - Length -> ELF_POOLS.length + ELF_BIASES.length
 * - Surname -> ELF_SURNAME_FAMILIES + ELF_BIASES.context/form/origin/nation
 * Each dimension is a standalone layer; disabling a checkbox skips its bias/crop,
 * and generation falls back to default families.
 */

export * from "./namePools/elfPools";
