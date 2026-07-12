import json
import os
import numpy as np
from sentence_transformers import SentenceTransformer  # pyrefly: ignore [missing-import]
from sklearn.metrics.pairwise import cosine_similarity  # pyrefly: ignore [missing-import]

# Fixed threshold — not exposed to frontend or API callers
SIMILARITY_THRESHOLD = 0.27

class SemanticSearchEngine:
    def __init__(self, posts_path="posts.json", model_name="all-MiniLM-L6-v2"):
        self.posts_path = posts_path
        self.model_name = model_name

        # Load posts
        if not os.path.exists(self.posts_path):
            raise FileNotFoundError(f"Dataset file not found at {self.posts_path}")

        with open(self.posts_path, "r") as f:
            self.posts = json.load(f)

        print(f"Loaded {len(self.posts)} posts. Initializing embedding model '{self.model_name}'...")

        # Load SentenceTransformer model
        self.model = SentenceTransformer(self.model_name)

        # Precompute embeddings for all post captions once at startup
        print("Precomputing post embeddings...")
        self.captions = [post["caption"] for post in self.posts]
        self.post_embeddings = self.model.encode(self.captions, show_progress_bar=False)
        print("Embeddings generated and cached in memory successfully.")

    def search(self, query):
        """
        Encodes the query and calculates cosine similarity against all post embeddings.
        Returns all posts with similarity >= SIMILARITY_THRESHOLD, sorted by descending score.
        The similarity_score is used internally for ranking only and is NOT returned to the client.
        """
        if not query.strip():
            return []

        # Encode only the query at runtime (post embeddings are precomputed)
        query_embedding = self.model.encode([query], show_progress_bar=False)

        # Calculate cosine similarity: shape (1, N) -> take first row
        similarities = cosine_similarity(query_embedding, self.post_embeddings)[0]

        results = []
        for idx, score in enumerate(similarities):
            score_val = float(score)
            if score_val >= SIMILARITY_THRESHOLD:
                # Return only the original post fields — no score exposed
                results.append(self.posts[idx].copy())

        # Sort by internal score (descending relevance)
        # We pair up scores with posts, sort, then strip the scores
        scored = [
            (float(similarities[i]), self.posts[i].copy())
            for i in range(len(self.posts))
            if float(similarities[i]) >= SIMILARITY_THRESHOLD
        ]
        scored.sort(key=lambda x: x[0], reverse=True)

        return [post for _, post in scored]
