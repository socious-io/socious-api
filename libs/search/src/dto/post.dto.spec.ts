import { PostDto } from './post.dto';

describe('PostDto', () => {
  it('should be defined', () => {
    expect(new PostDto()).toBeDefined();
  });
});
