const hibpService = require('../services/hibpService');

describe('hibpService', () => {
  it('should correctly parse the count of a leaked suffix', () => {
    const mockData = `0018A45C4D1DEF81644B54AB7F969B88D65:2\r\nC88CEB418598DEDBC567B549E780E2390:1000\r\nFFF8A45C4D1DEF81644B54AB7F969B88D65:5`;
    const count = hibpService.findSuffixCount(mockData, 'C88CEB418598DEDBC567B549E780E2390');
    expect(count).toBe(1000);
  });

  it('should return 0 if suffix is not found', () => {
    const mockData = `0018A45C4D1DEF81644B54AB7F969B88D65:2`;
    const count = hibpService.findSuffixCount(mockData, 'C88CEB418598DEDBC567B549E780E2390');
    expect(count).toBe(0);
  });
});
