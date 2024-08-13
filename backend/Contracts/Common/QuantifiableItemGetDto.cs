namespace Cookbook.Contracts.Common;

public record QuantifiableItemGetDto(int Id, string Name, AmountGetDto Amount, bool Checked);