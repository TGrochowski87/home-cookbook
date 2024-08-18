namespace Cookbook.Contracts.Common;

public record QuantifiableItemGetDto(int Id, string Name, AmountDto Amount, bool Checked);