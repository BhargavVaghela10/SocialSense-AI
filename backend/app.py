import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from search_engine import SemanticSearchEngine

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for the frontend

# Resolve posts.json path relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
POSTS_PATH = os.path.join(BASE_DIR, "posts.json")

print("Starting Flask server and loading semantic search engine...")
search_engine = SemanticSearchEngine(posts_path=POSTS_PATH)


@app.route("/api/posts", methods=["GET"])
def get_posts():
    """Returns all posts in the dataset (used for initial page load)."""
    return jsonify(search_engine.posts)


@app.route("/api/search", methods=["GET"])
def search():
    """
    Semantic search endpoint.

    Query Parameters:
        q (str): The search query string. Required.

    Returns JSON with:
        query         - the original query
        results_count - number of matched posts
        results       - list of matched post objects (sorted by relevance)

    The similarity threshold is fixed server-side and is not user-configurable.
    """
    query = request.args.get("q", "").strip()

    if not query:
        return jsonify({"error": "Query parameter 'q' is required"}), 400

    try:
        results = search_engine.search(query)
        return jsonify({
            "query": query,
            "results_count": len(results),
            "results": results
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint — confirms the server and model are loaded."""
    return jsonify({
        "status": "healthy",
        "model": search_engine.model_name,
        "total_posts": len(search_engine.posts)
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)
