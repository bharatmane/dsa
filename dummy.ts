// applyFilters.test.js
import { applyFilters } from './path/to/your/applyFilters';
import * as marginCallGridUtils from './marginCallGridUtils'; // adjust this path if necessary

// Mock the applySetFilter function
jest.mock('./marginCallGridUtils');

describe('applyFilters', () => {
  let selectedMCFavorite, gridRef, applyFiltersIntervalId;

  beforeEach(() => {
    selectedMCFavorite = {
      state: {
        filterState: {
          key1: { filterType: 'set', values: ['val1', 'val2'] },
          key2: { filterType: 'other' }
        }
      }
    };

    gridRef = {
      current: {
        api: {
          setFilterModel: jest.fn(),
          getColumnFilterInstance: jest.fn().mockResolvedValue({
            getValues: jest.fn().mockResolvedValue(['val1', 'val2', 'val3'])
          })
        }
      }
    };

    applyFiltersIntervalId = { current: 1234 };

    // Ensure applySetFilter mock returns a resolved promise
    marginCallGridUtils.applySetFilter.mockResolvedValue(true);

    // Spy on console log
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should apply filters correctly', async () => {
    await applyFilters(selectedMCFavorite, gridRef, applyFiltersIntervalId);

    expect(console.log).toHaveBeenCalledWith('Calling applySetFilter for key: key1');
    expect(marginCallGridUtils.applySetFilter).toHaveBeenCalledWith(gridRef, 'key1', selectedMCFavorite.state.filterState.key1, expect.any(Object));
    expect(gridRef.current.api.setFilterModel).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should clear interval if all selected values found and interval exists', async () => {
    jest.spyOn(global, 'clearInterval');

    await applyFilters(selectedMCFavorite, gridRef, applyFiltersIntervalId);

    expect(clearInterval).toHaveBeenCalledWith(applyFiltersIntervalId.current);
    expect(applyFiltersIntervalId.current).toBeNull();
  });

  it('should not clear interval if not all selected values found', async () => {
    marginCallGridUtils.applySetFilter.mockResolvedValueOnce(false);

    await applyFilters(selectedMCFavorite, gridRef, applyFiltersIntervalId);

    expect(gridRef.current.api.setFilterModel).toHaveBeenCalledWith(expect.any(Object));
    expect(global.clearInterval).not.toHaveBeenCalled();
    expect(applyFiltersIntervalId.current).not.toBeNull();
  });

  it('should handle errors gracefully', async () => {
    marginCallGridUtils.applySetFilter.mockRejectedValue(new Error('Test error'));

    await applyFilters(selectedMCFavorite, gridRef, applyFiltersIntervalId);

    expect(console.error).toHaveBeenCalledWith('Error in applyFilters:', expect.any(Error));
  });
});
